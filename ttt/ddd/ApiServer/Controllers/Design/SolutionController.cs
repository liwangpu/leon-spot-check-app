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
    public class SolutionController : Controller
    {
        private readonly Repository<Solution> repo;

        public SolutionController(Data.ApiDbContext context)
        {
            repo = new Repository<Solution>(context);
        }

        [HttpGet]
        public PagedData<Solution> Get(string search, int page, int pageSize, string orderBy, bool desc)
        {
            PagingMan.CheckParam(ref search, ref page, ref pageSize);
            return repo.Get(AuthMan.GetAccountId(this), page, pageSize, orderBy, desc,
                string.IsNullOrEmpty(search) ? (Func<Solution, bool>)null : d => d.Id.HaveSubStr(search) || d.Name.HaveSubStr(search) || d.Description.HaveSubStr(search));
        }

        [HttpGet("{id}")]
        [Produces(typeof(Solution))]
        public IActionResult Get(string id)
        {
            var res = repo.Get(AuthMan.GetAccountId(this), id);
            if (res == null)
                return NotFound();
            return Ok(res);//return Forbid();
        }

        [Route("NewOne")]
        [HttpGet]
        public Solution NewOne()
        {
            return EntityFactory<Solution>.New();
        }

        [HttpPost]
        [Produces(typeof(Solution))]
        public IActionResult Post([FromBody]Solution value)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);

            value = repo.Create(AuthMan.GetAccountId(this), value);
            return CreatedAtAction("Get", value);
        }

        [HttpPut]
        [Produces(typeof(Solution))]
        public IActionResult Put([FromBody]Solution value)
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

        [Route("UpdateData")]
        [HttpPost]
        public IActionResult UpdateData(string id, [FromBody]string data)
        {
            if (data == null)
                data = "";
            string accid = AuthMan.GetAccountId(this);
            if (repo.CanUpdate(accid, id) == false)
                return Forbid();

            var obj = repo.Get(accid, id);
            if (obj == null)
                return Forbid();
            obj.Data = data;
            repo.SaveChangesAsync();

            return Ok();
        }
    }
}
