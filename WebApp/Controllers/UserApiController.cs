using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;

namespace WebApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class UserApiController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {
            return User.Identity.IsAuthenticated ? User.Identity.Name : string.Empty;
        }
    }
}