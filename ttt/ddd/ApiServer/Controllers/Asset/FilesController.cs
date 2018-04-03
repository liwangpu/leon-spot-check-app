using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using ApiModel;
using BambooCore;
using ApiServer.Services;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace ApiServer.Controllers.Asset
{
    [Authorize]
    [Route("/[controller]")]
    public class FilesController : Controller
    {

        private readonly Repository<FileAsset> repo;
        private IHostingEnvironment hostEnv;
        private string uploadPath;

        public FilesController(Data.ApiDbContext context, IHostingEnvironment env)
        {
            repo = new Repository<FileAsset>(context);
            hostEnv = env;

            uploadPath = hostEnv.WebRootPath + "/upload/";
            if(Directory.Exists(uploadPath) == false)
                Directory.CreateDirectory(uploadPath);
        }

        [HttpGet]
        public PagedData<FileAsset> Get(string search, int page, int pageSize, string orderBy, bool desc)
        {
            PagingMan.CheckParam(ref search, ref page, ref pageSize);
            return repo.Get(AuthMan.GetAccountId(this), page, pageSize, orderBy, desc,
                string.IsNullOrEmpty(search) ? (Func<FileAsset, bool>)null : d => d.Id.HaveSubStr(search) || d.Name.HaveSubStr(search) || d.Description.HaveSubStr(search));
        }

        [HttpGet("{id}")]
        [Produces(typeof(FileAsset))]
        public IActionResult Get(string id)
        {
            var res = repo.Get(AuthMan.GetAccountId(this), id);
            if (res == null)
                return NotFound();
            return Ok(res);//return Forbid();
        }

        [Route("NewOne")]
        [HttpGet]
        public FileAsset NewOne()
        {
            return EntityFactory<FileAsset>.New();
        }

        [HttpPost]
        [Produces(typeof(FileAsset))]
        public IActionResult Post([FromBody]FileAsset value)
        {
            if (ModelState.IsValid == false)
                return BadRequest(ModelState);

            value = repo.Create(AuthMan.GetAccountId(this), value);
            return CreatedAtAction("Get", value);
        }

        [HttpPut]
        [Produces(typeof(FileAsset))]
        public IActionResult Put([FromBody]FileAsset value)
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

        /// <summary>
        /// 上传一个文件，文件放在body中。服务器会把此文件存在upload文件夹中，并在账号上创建一个FileAsset，并返回数据给客户端。
        /// 建议客户端需要再次使用PUT /files API来修改此FileAsset，为其补全一些备注信息，比如文件本地文件名，描述信息。
        /// </summary>
        /// <returns></returns>
        [Route("Upload")]
        [HttpPost]
        public FileAsset Upload()
        {
            string name = Guid.NewGuid().ToString();
            FileAsset res = new FileAsset();
            res.Id = GuidGen.NewGUID();
            res.Name = name;
            res.Url = "/upload/" + name;

            string localPath = uploadPath + name;
            using (StreamWriter sw = new StreamWriter(localPath))
            {
                var bodystream = HttpContext.Request.Body;
                bodystream.CopyTo(sw.BaseStream);
            }
            FileInfo fi = new FileInfo(localPath);
            res.Size = fi.Length;
            res.Md5 = Md5.CalcFile(localPath);
            repo.Create(AuthMan.GetAccountId(this), res, false);

            return res;
        }

        [Route("UploadFormFile")]
        [HttpPost]
        public IActionResult UploadFormFile(IFormFile file)
        {
            if (file == null)
                return BadRequest();

            // 原文件名（包括路径）
            var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
            // 扩展名
            var extName = filename.Substring(filename.LastIndexOf('.')).Replace("\"", "");
            // 新文件名
            string shortfilename = $"{Guid.NewGuid()}{extName}";
            // 新文件名（包括路径）
            filename = hostEnv.WebRootPath + @"\upload\" + shortfilename;
            // 设置文件大小
            long size = file.Length;
            // 创建新文件
            using (FileStream fs = System.IO.File.Create(filename))
            {
                file.CopyTo(fs);
                // 清空缓冲区数据
                fs.Flush();
            }
            return Ok();
        }
    }
}
