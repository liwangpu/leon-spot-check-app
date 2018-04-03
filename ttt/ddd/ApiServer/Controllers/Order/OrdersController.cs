using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ApiModel;
using BambooCore;
using ApiServer.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiServer.Controllers
{
    [Authorize]
    [Route("/[controller]")]
    public class OrdersController : Controller
    {
        private readonly Repository<Order> repo;

        public OrdersController(Data.ApiDbContext context)
        {
            repo = new Repository<Order>(context);
        }
        
        [HttpGet]
        public PagedData<Order> Get(string search, int page, int pageSize, string orderBy, bool desc)
        {
            PagingMan.CheckParam(ref search, ref page, ref pageSize);
            return repo.Get(AuthMan.GetAccountId(this), page, pageSize, orderBy, desc,
                string.IsNullOrEmpty(search) ? (Func<Order, bool>)null : d => d.Id.HaveSubStr(search) || d.Name.HaveSubStr(search) || d.Content.HaveSubStr(search));
        }
        
        [HttpGet("{id}")]
        [Produces(typeof(Order))]
        public IActionResult Get(string id)
        {
            var res = repo.Get(AuthMan.GetAccountId(this), id);
            if (res == null)
                return NotFound();
            //加载Order的依赖数据，OrderStates
            repo.Context.Entry(res).Collection(d => d.OrderStates).Load();
            return Ok(res);
        }

        
        [HttpPost]
        public IActionResult Post([FromBody]Order value)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);

            string accid = AuthMan.GetAccountId(this);
            value.Id = GuidGen.NewGUID();
            value.AccountId = accid;
            value.CreateTime = DateTime.UtcNow;
            value.ModifyTime = value.CreateTime;

            value = repo.Create(accid, value);
            return CreatedAtAction("Get", value);
        }
        
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            bool bOk = repo.Delete(AuthMan.GetAccountId(this), id);
            if(bOk)
            {
                return Ok();
            }
            return NotFound(); // 或者权限不够
        }

        [Route("ChangeState")]
        [HttpPost]
        public IActionResult ChangeState(string id, [FromBody]OrderStateItem state)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);

            string accid = AuthMan.GetAccountId(this);
            if (repo.CanUpdate(accid, id) == false)
                return Forbid();

            var res = repo.Get(accid, id);
            if (res == null)
                return NotFound();

            res.StateTime = DateTime.UtcNow;
            if(res.OrderStates == null)
            {
                res.OrderStates = new List<OrderStateItem>();
            }
            state.Id = GuidGen.NewGUID();
            state.Order = res;
            state.OrderId = res.Id;
            state.OldState = res.State;
            state.OperateTime = DateTime.UtcNow;
            res.State = state.NewState;
            res.OrderStates.Add(state);
            repo.SaveChangesAsync();
            return Ok();
        }


        [Route("ChangeContent")]
        [HttpPost]
        public IActionResult ChangeContent(string id, [FromBody]OrderContent content)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);

            string accid = AuthMan.GetAccountId(this);
            if (repo.CanUpdate(accid, id) == false)
                return Forbid();

            var res = repo.Get(accid, id);
            if (res == null)
                return NotFound();

            res.Content = Newtonsoft.Json.JsonConvert.SerializeObject(content);
            res.ModifyTime = DateTime.UtcNow;
            repo.SaveChangesAsync();
            return Ok();
        }

        [Route("NewOne")]
        [HttpGet]
        public Order NewOne()
        {
            return EntityFactory<Order>.New();
        }
    }
}
