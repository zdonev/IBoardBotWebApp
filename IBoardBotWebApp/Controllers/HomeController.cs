using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace IBoardBotWebApp.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var pars = new Models.Paramters()
            {
                AppId = Properties.Settings.Default.AppId,
                AdmireTimerValue = Properties.Settings.Default.AdmireTimerValue,
                DrawTimerValue = Properties.Settings.Default.DrawTimerValue,
                EraseTimerValue = Properties.Settings.Default.EraseTimerValue
            };


            return View(pars);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult EraseBot()
        {
            //        var parameters = {
            //    "APPID": appid,
            //    "X1": 0,
            //    "Y1": 0,
            //    "X2": 358,
            //    "Y2": 105
            //};
            //$.post("http://ibbapp.jjrobots.com/pErase.php", parameters, function (data) { });

            var AppId = Properties.Settings.Default.AppId;
            var pars = string.Format("APPID={0}&X1=0&Y1=0&X2=358&Y2=105", AppId);
            var uri = "http://ibbapp.jjrobots.com/pErase.php";
            using (WebClient client = new WebClient())
            {
                client.Headers.Add(HttpRequestHeader.ContentType, "application/x-www-form-urlencoded; charset=UTF-8");
                var result = client.UploadString(uri, pars);                                
            }

            return null;
        }
    }
}