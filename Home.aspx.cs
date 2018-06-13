using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;
using System.Xml.Linq;

public partial class Home : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        NameValueCollection n = Request.QueryString;
        // 2
        // See if any query string exists
        ////if (n.HasKeys())
        ////{
        ////    // 3
        ////    // Get first key and value
        ////    string k = n.GetKey(0);
        ////    string v = n.Get(0);
        ////    // 4
        ////    // Test different keys
        ////    if (k == "param")
        ////    {
        ////        Response.Write("param is " + v);
        ////    }
        ////    if (k == "idd")
        ////    {
        ////        Response.Write("id is " + v);
        ////    }
        ////}
        //HttpWebRequest req = (HttpWebRequest)WebRequest.Create("https://www.servirglobal.net/DesktopModules/GeoPortalMetaDataViewer/XmlDownload.aspx");
        //req.ProtocolVersion = HttpVersion.Version11;
        //req.ContentType = "text/xml;charset=\"utf-8\"";
        //req.Accept = "text/xml";
        //req.KeepAlive = true;
        //req.Method = "POST";

        //using (Stream stm = req.GetRequestStream())
        //{
        //   // using (StreamWriter stmw = new StreamWriter(stm))
        //        //stmw.Write(soapStr);
        //}
        //using (StreamReader responseReader = new StreamReader(req.GetResponse().GetResponseStream()))
        //{
        //    string result = responseReader.ReadToEnd();
        //    var ResultXML = XDocument.Parse(result);
        //    githika.InnerHtml = ResultXML.ToString();
        //}


    }

    [System.Web.Services.WebMethod]
    public static void getHTML(string url)
    {
        string htmlCode = "";
        StreamReader inStream;
        WebRequest webRequest;
        WebResponse webresponse;
        webRequest = WebRequest.Create(url);
        webresponse = webRequest.GetResponse();
        inStream = new StreamReader(webresponse.GetResponseStream());
        htmlCode = inStream.ReadToEnd();
        // return htmlCode;
        StreamWriter file = new StreamWriter(System.Web.HttpContext.Current.Server.MapPath("~/img/main/temp.js"));
        
        
      //  htmlCode = htmlCode.Replace(@"\r\n", "");
        //htmlCode = htmlCode.Trim();
       
        WebClient webClient = new WebClient();
      //  string page = webClient.DownloadString("http://www.mufap.com.pk/payout-report.php?tab=01");

        HtmlAgilityPack.HtmlDocument doc = new HtmlAgilityPack.HtmlDocument();
        doc.LoadHtml(htmlCode);
        string sh = "",sd="",opt="";
        try
        {
            List<List<string>> tableh = doc.DocumentNode.SelectSingleNode("//table[@class='featureInfo']")
                       .Descendants("tr")
                      
                       .Where(tr => tr.Elements("th").Count() > 1)
                       .Select(tr => tr.Elements("th").Select(th => th.InnerText.Trim()).ToList())
                       .ToList();
            foreach (var list in tableh)
            {
                foreach (var item in list)
                {
                    sh = sh+item + "," ;
                }
            }
            List<List<string>> tabler = doc.DocumentNode.SelectSingleNode("//table[@class='featureInfo']")
                        .Descendants("tr")
                        .Skip(1)
                        .Where(tr => tr.Elements("td").Count() > 1)
                        .Select(tr => tr.Elements("td").Select(td => td.InnerText.Trim()).ToList())
                        .ToList();
            foreach (var list in tabler)
            {
                foreach (var item in list)
                {
                    sd = sd + item +",";
                }
            }
       
            for (int i = 0; i < sh.Split(',').Length-1; i++)
            {
              opt= opt+ sh.Split(',')[i]+":"+ sd.Split(',')[i]+ "^";
              
            }
           

            file.Write("varfortable='"+opt+"';");
        }
        catch(Exception ex)
        {
            file.WriteLine("");
        }

        file.Close();
    }

}
