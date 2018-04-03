using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ApiModel;
using ApiServer.Services;
using BambooCommon;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiServer.Controllers
{
    /// <summary>
    /// 账号相关的接口
    /// </summary>
    [Authorize]
    [Route("/[controller]")]
    public class AccountController : Controller
    {
        AccountMan accountMan;

        public AccountController(Data.ApiDbContext context)
        {
            accountMan = new AccountMan(context);
        }

        /// <summary>
        /// 注册新账号
        /// </summary>
        /// <param name="value">新账号的基本信息</param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("Register")]
        [HttpPost]
        [Produces(typeof(Account))]
        public IActionResult Register([FromBody]RegisterAccountModel value)
        {
            if(ModelState.IsValid == false)
            {
                return BadRequest(ModelState);
            }
            Account acc = accountMan.Register(value);
            if (acc == null)
                return BadRequest();
            return Ok(acc);
        }

        /// <summary>
        /// 重置密码
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [Route("ResetPassword")]
        [HttpPost]
        public IActionResult ResetPassword([FromBody]ResetPasswordModel value)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);
            return Ok();
        }

        /// <summary>
        /// 设置新密码
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [Route("NewPassword")]
        [HttpPost]
        public IActionResult NewPassword([FromBody]NewPasswordModel value)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);
            bool bOk = accountMan.ChangePassword(AuthMan.GetAccountId(this), value);
            if (bOk)
                return Ok();
            return BadRequest();
        }

        /// <summary>
        /// 修改账号信息
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        [Route("Profile")]
        [HttpPost]
        public IActionResult EditProfile([FromBody]AccountProfileModel value)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);
            bool bOk = accountMan.UpdateProfile(AuthMan.GetAccountId(this), value);
            if (bOk)
                return Ok();
            return BadRequest();
        }

        /// <summary>
        /// 获取账号信息
        /// </summary>
        /// <returns></returns>
        [Route("Profile")]
        [HttpGet]
        public AccountProfileModel GetProfile()
        {
            return accountMan.GetProfile(AuthMan.GetAccountId(this));
        }

        /// <summary>
        /// 获取这个账号的网站后台导航菜单配置
        /// </summary>
        /// <returns></returns>
        [Route("Navigation")]
        [HttpGet]
        public NavigationModel GetNavigationData()
        {
            return accountMan.GetNavigation(AuthMan.GetAccountId(this));
        }
    }
}
