using System;
using System.Collections.Generic;
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
}
