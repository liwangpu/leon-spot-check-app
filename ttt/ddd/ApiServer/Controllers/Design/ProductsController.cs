using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using ApiModel;
using BambooCommon;
using BambooCore;
using ApiServer.Services;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiServer.Controllers.Design
{
    [Authorize]
    [Route("/[controller]")]
    public class ProductsController : Controller
    {
        private readonly Repository<Product> repo;

        public ProductsController(Data.ApiDbContext context)
        {
            repo = new Repository<Product>(context);
        }

        [HttpGet]
        public PagedData<Product> Get(string search, int page, int pageSize, string orderBy, bool desc)
        {
            PagingMan.CheckParam(ref search, ref page, ref pageSize);
            return repo.Get(AuthMan.GetAccountId(this), page, pageSize, orderBy, desc,
                string.IsNullOrEmpty(search) ? (Func<Product, bool>)null : d => d.Id.HaveSubStr(search) || d.Name.HaveSubStr(search) || d.Description.HaveSubStr(search));
        }

        [HttpGet("{id}")]
        [Produces(typeof(Product))]
        public IActionResult Get(string id)
        {
            var res = repo.Get(AuthMan.GetAccountId(this), id);
            if (res == null)
                return NotFound();
            return Ok(res);//return Forbid();
        }

        [Route("NewOne")]
        [HttpGet]
        public Product NewOne()
        {
            return EntityFactory<Product>.New();
        }

        [HttpPost]
        [Produces(typeof(Product))]
        public IActionResult Post([FromBody]Product value)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);

            value = repo.Create(AuthMan.GetAccountId(this), value);
            return CreatedAtAction("Get", value);
        }

        [HttpPut]
        [Produces(typeof(Product))]
        public IActionResult Put([FromBody]Product value)
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
