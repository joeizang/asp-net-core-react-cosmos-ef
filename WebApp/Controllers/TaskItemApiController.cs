using System.Collections.Generic;
using System.Net.Mime;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models;
using WebApp.Repository;

namespace WebApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    [Consumes(MediaTypeNames.Application.Json)]
    public class TaskItemApiController : ControllerBase
    {
        private readonly IItemsRepo _itemsRepo;

        public TaskItemApiController(IItemsRepo itemsRepo)
        {
            _itemsRepo = itemsRepo;
        }

        [HttpGet]
        public IAsyncEnumerable<TaskItem> GetAsync() => _itemsRepo.GetItemsAsync();

        [HttpGet("{id}")]
        public async Task<TaskItem> GetAsync(string id) => await _itemsRepo.GetItemAsync(id);

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<TaskItem>> CreateAsync(TaskItem taskItem)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }
            if (!(string.IsNullOrEmpty(taskItem.Id) && User.Identity.Name?.Equals(taskItem.Owner) == true))
            {
                return BadRequest();
            }

            var createdItem = await _itemsRepo.AddItemAsync(taskItem);
            return CreatedAtAction(nameof(GetAsync), new { id = createdItem.Id }, createdItem);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<TaskItem>> UpdateAsync(string id, TaskItem taskItem)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            if (!(id?.Equals(taskItem.Id) == true
                  && User.Identity.Name?.Equals(taskItem.Owner) == true))
            {
                return BadRequest();
            }
            var updatedItem = await _itemsRepo.UpdateItemAsync(id, taskItem);
            if (updatedItem == null)
            {
                return BadRequest();
            }

            return Ok(updatedItem);
        }

        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> DeleteAsync(string id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized();
            }

            await _itemsRepo.DeleteItemAsync(id, User.Identity.Name);
            return NoContent();
        }
    }
}