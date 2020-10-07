using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp.Models;
using WebApp.Repository;

namespace WebApp.Controllers
{
    public class TaskItemMvcController : Controller
    {
        private readonly IItemsRepo _itemsRepo;
        
        public TaskItemMvcController(IItemsRepo itemsRepo)
        {
            _itemsRepo = itemsRepo;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Index() => View("Index",_itemsRepo.GetItemsAsync());

        [Authorize]
        public IActionResult Create() => View();

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create(TaskItem item)
        {
            if (!ModelState.IsValid)
            {
                return View(item);
            }
            await _itemsRepo.AddItemAsync(item);
            return RedirectToAction("Index");
        }

        [Authorize]
        public async Task<ActionResult> Edit(string id)
        {
            var item = await _itemsRepo.GetItemAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            return View(item);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Edit(TaskItem item)
        {
            if (!ModelState.IsValid)
            {
                return View(item);
            }
            await _itemsRepo.UpdateItemAsync(item.Id, item);
            return RedirectToAction("Index");
        }

        [Authorize]
        public async Task<ActionResult> Delete(string id)
        {
            if (id == null)
            {
                return BadRequest();
            }

            var item = await _itemsRepo.GetItemAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            return View(item);
        }

        [HttpPost]
        [ActionName("Delete")]
        [Authorize]
        public async Task<ActionResult> DeleteConfirmedAsync(string id)
        {
            await _itemsRepo.DeleteItemAsync(id, User.Identity.Name);
            return RedirectToAction("Index");
        }

        public async Task<ActionResult> Details(string id) => 
            View(await _itemsRepo.GetItemAsync(id));
    }
}