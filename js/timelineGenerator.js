let years_new = [];
let years1 = [];
var arr = [];
var gint = 0;
var stdate = "";
var thereturn;
var endDate;
var frameRate = 0.5; // frames per second
var animationId = null;
var startdatepicker = "";
var enddatepicker = "";
var startDate;

var selection = "";
var i = 0;
for (var i = 0; i < 24; i++) {
    var j = zeroFill(i, 2);
    selection += "<option value='" + j + "00'>" + j + ":00" + "</option>";
    selection += "<option value='" + j + "30'>" + j + ":30" + "</option>";
}
$(".time").html(selection);
function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}


function loadXMLDoc() {
   
    $.ajax({
        url: urlt1.replace('arcgis','arcgis/rest') + "?f=pjson",

        // The name of the callback parameter, as specified by the YQL service
        jsonp: "callback",

        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",

        // Tell YQL what we want and that we want JSON
        data: {
            q: "select title,abstract,url from search.news where query=\"cat\"",
            format: "json"
        },

        // Work with the response
        success: function (response) {

            arr.push(response.timeInfo.timeExtent[0]);
            // startDate = response.timeInfo.timeExtent[0];
            arr.push(response.timeInfo.timeExtent[1]);
            gint = Number(response.timeInfo.defaultTimeInterval);
            stdate = new Date(arr[0]);
           
            addlistelements(new Date(arr[0]), new Date(arr[1]), gint);
            console.log(response); // server response
            console.log(response.timeInfo.defaultTimeInterval);
            startDate = new Date(arr[0]);

            thereturn = response;
        }
    });
}





function updateInfo() {
    var el = document.getElementById('info');
    el.innerHTML = startDate;
}
function setTime() {

    if (startDate >= endDate) {
        if (animationId !== null) {
            window.clearInterval(animationId);
            animationId = null;
        }
    } else {
        if (gint > 0)
            startDate.setMinutes(startDate.getMinutes() + gint);
        else
            startDate.setMinutes(startDate.getMinutes() + 30);
        if (startDate > Date.now()) {
            startDate = stdate;
        }
        urlfortimeline.getSource().updateParams({ 'TIME': startDate.toISOString() });

        updateInfo();
    }
}

//setTime();

var stop = function () {
    startDate = new Date(document.getElementById("info").innerText);
    if (animationId !== null) {
        window.clearInterval(animationId);
        animationId = null;
    }
};
var play = function () {
    stop();
    animationId = window.setInterval(setTime, 1000 / frameRate);
};

//  updateInfo();


$(function () {

    var dateFormat = "mm/dd/yy",
from = $("#from")
  .datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
  })
  .on("change", function () {
      to.datepicker("option", "minDate", getDate(this));

  }),
to = $("#to").datepicker({
    defaultDate: "+1w",
    changeMonth: true,
    numberOfMonths: 1
})
.on("change", function () {
    loadXMLDoc();
    from.datepicker("option", "maxDate", getDate(this));
});

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }

    var forIndex = 0;
    var flags = 0;
    var testing;
    var yindex = 0;
    var forIndexA;
    var slidingId = null;
    function setslidervalue() {
        let yearslider = document.querySelector("#yearslider");
        let output = document.querySelector("#rangevalue");
        yearslider.value = years_new[yindex];
        if (years1[yindex]!=undefined)
            output.value =years1[yindex];
        yindex = yindex + 1;
        var e = document.getElementById("fromtime");
        var strUser = e.options[e.selectedIndex].value;
        var e1 = document.getElementById("totime");
        var strUser1 = e1.options[e1.selectedIndex].value;
        startdatepicker = new Date(document.getElementById("from").value + " " + strUser.slice(0, 2) + ":" + strUser.slice(2) + ":" + "00");
        enddatepicker = new Date(document.getElementById("to").value + " " + strUser1.slice(0, 2) + ":" + strUser1.slice(2) + ":" + "00");

        //    startDate = startdatepicker;
        startDate = new Date(years1[yindex]);
        endDate = enddatepicker;
    }
    $("#pause").addClass("PlayORPause");
    $("#play").on('click', function () {
        $("#play").addClass("PlayORPause");
        $("#pause").removeClass("PlayORPause");

        document.getElementById("status").innerHTML = "Status: Playing..";

        if (slidingId !== null) {
            window.clearInterval(slidingId);
            slidingId = null;
        }
        slidingId = window.setInterval(setslidervalue, 1000 / frameRate);


        if (animationId !== null) {
            window.clearInterval(animationId);
            animationId = null;
        }
        animationId = window.setInterval(setTime, 1000 / frameRate);

    });
    $("#pause").on('click', function () {
        $("#pause").addClass("PlayORPause");
            $("#play").removeClass("PlayORPause");

        document.getElementById("status").innerHTML = "Status: Paused!";

        let yearslider = document.querySelector("#yearslider");
        let output = document.querySelector("#rangevalue");
        yearslider.value = years_new[yindex];
        if (years1[yindex] != undefined)
            output.value = years1[yindex];
        if (slidingId !== null) {
            window.clearInterval(slidingId);
            slidingId = null;
        }

        if (animationId !== null) {
            window.clearInterval(animationId);
            animationId = null;
        }
    });


});

var li; var ul;

function addlistelements(st, et, g) {
   
    if (document.getElementById("from").value == "" || document.getElementById("to").value == "") {
        //alert("Populating dates to time extent" + st);
        document.getElementById("from").value = (st.getMonth() + 1) + "/" + (st.getDate()) + "/" + st.getFullYear();
        document.getElementById("to").value = (et.getMonth() + 1) + "/" + (et.getDate()) + "/" + et.getFullYear();
        $('#fromtime').val(("0" + st.getHours()).slice(-2) + ("0" + st.getMinutes()).slice(-2));
        $('#totime').val(("0" + et.getHours()).slice(-2) + ("0" + et.getMinutes()).slice(-2));
    }
    else if (new Date(document.getElementById("from").value) < st || new Date(document.getElementById("to").value) > et) {
        //alert("please select date range in " + st + " and " + et);
        document.getElementById("from").value = (st.getMonth() + 1) + "/" + (st.getDate()) + "/" + st.getFullYear();
        document.getElementById("to").value = (et.getMonth() + 1) + "/" + (et.getDate()) + "/" + et.getFullYear();

        $('#fromtime').val(("0" + st.getHours()).slice(-2) + ("0" + st.getMinutes()).slice(-2));
        $('#totime').val(("0" + et.getHours()).slice(-2) + ("0" + et.getMinutes()).slice(-2));
    }
    else {
        startdatepicker = new Date(document.getElementById("from").value);
        enddatepicker = new Date(document.getElementById("to").value);
        //  alert("populating timeline");
        st = startdatepicker;
        et = enddatepicker;
        startDate = st;
        endDate = et;
        var x = [];
        var i = 0;
        var years = [];
        var stt = st;
        var dlist = [];
        while (stt <= et) {

            stt.setMinutes(stt.getMinutes() + g);
            dlist.push(stt.toISOString());

        }
        var numarr = [];
        for (var n = 0; n < dlist.length; n++) {
            numarr[n] = n + 1;
        }
        var options = '';
        document.getElementById("yearslider").max = numarr[numarr.length - 1];
        document.getElementById("yearslider").min = numarr[0];
        document.getElementById("yearslider").value = numarr[0];
        for (var i = 0; i < numarr.length; i++)
            options += '<option value="' + numarr[i] + '" />';

        document.getElementById('ticks').innerHTML = options;
        years_new = numarr;
        years1 = dlist;
        while (stt <= et) {

            stt.setMinutes(stt.getMinutes() + g);

        }

    }
}
