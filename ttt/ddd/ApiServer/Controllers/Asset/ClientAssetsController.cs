using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ApiModel;
using BambooCore;
using Microsoft.AspNetCore.Authorization;
using ApiServer.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiServer.Controllers
{
    [Authorize]
    [Route("/[controller]")]
    public class ClientAssetsController : Controller
    {
        private readonly Repository<ClientAsset> repo;

        public ClientAssetsController(Data.ApiDbContext context)
        {
            repo = new Repository<ClientAsset>(context);
        }

        [HttpGet]
        public PagedData<ClientAsset> Get(string search, int page, int pageSize, string orderBy, bool desc)
        {
            PagingMan.CheckParam(ref search, ref page, ref pageSize);
            return repo.Get(AuthMan.GetAccountId(this), page, pageSize, orderBy, desc,
                string.IsNullOrEmpty(search) ? (Func<ClientAsset, bool>)null : d => d.Id.HaveSubStr(search) || d.Name.HaveSubStr(search) || d.Description.HaveSubStr(search));
        }

        [HttpGet("{id}")]
        [Produces(typeof(ClientAsset))]
        public IActionResult Get(string id)
        {
            var res = repo.Get(AuthMan.GetAccountId(this), id);
            if (res == null)
                return NotFound();
            return Ok(res);//return Forbid();
        }

        [Route("NewOne")]
        [HttpGet]
        public ClientAsset NewOne()
        {
            return EntityFactory<ClientAsset>.New();
        }

        [HttpPost]
        [Produces(typeof(ClientAsset))]
        public IActionResult Post([FromBody]ClientAsset value)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);

            value = repo.Create(AuthMan.GetAccountId(this), value);
            return CreatedAtAction("Get", value);
        }

        [HttpPut]
        [Produces(typeof(ClientAsset))]
        public IActionResult Put([FromBody]ClientAsset value)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);

            var res = repo.Update(AuthMan.GetAccountId(this), value);
            if (res == null)
                return NotFound();
            return Ok(value);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            bool bOk = repo.Delete(AuthMan.GetAccountId(this), id);
            if (bOk)
                return Ok();
            return NotFound();//return Forbid();
        }        
        
        
    }
}
