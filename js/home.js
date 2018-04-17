
var currLayer;
function slideLeft(element) {
    $(element).animate({
        left: "-=360"
    }, 700, function () { });
}
function slideRight(element) {
    $(element).animate({
        left: "+=360"
    }, 700, function () { });
}
function hidePanel(panel, image, icon) {
    slideLeft(panel);
    $(icon).removeClass('hide').addClass('show');
    $(panel).removeClass('show').addClass('hide');
}
function showPanel(panel, image, icon) {
    slideRight(panel);
    $(icon).removeClass('show').addClass('hide');
    $(panel).removeClass('hide').addClass('show');
}

function changeIcon(maptype, imageId, imageSource, color) {
    var str = "white";
    var src = "/img/main/";
    var png = ".png";
    if (maptype == "dark" && color == "") {
        $(imageId).css({ opacity: 0.5 });
    }
    else if (maptype == "dark" && color == "green") {
        $(imageId).css({ opacity: 1 });

    }
    else if (color == "green" && maptype == "") {
        $(imageId).css({ opacity: 1 });

    }
    else if (color == "" && maptype == "") {
        $(imageId).css({ opacity: 0.5 });
    }
}
var maptype = "";
//panes-layers,basemaps and data
$(function () {
    $(".basemaps").click(function () {
        var type = this.id;
        setMapType(type);

    });
    //$("#chg").change(function () {
    //    $(this).css('background-color', $(this).val());
    //    var str = $(this).val();

    //    $(".t_panel").css("background", str);
    //    $(".t_panel_layer").css("background", str);
    //    $(".t_panel_maps").css("background", str);
    //    $(".modal-content").css("background", str);

    //});
    $('.slide_button').click(function () {
        if ($(this).hasClass('data')) {
            hidePanel(".t_panel", "#d_img", "#data_icon");
            changeIcon("", "#d_image", "download", "");
        }

        if ($(this).hasClass('layer')) {
            hidePanel(".t_panel_layer", "#l_img", "#layer_icon");
            changeIcon("", "#l_image", "layer", "");
        }
        if ($(this).hasClass('maps')) {
            hidePanel(".t_panel_maps", "#b_img", "#basemap_icon");
            changeIcon("", "#b_image", "map", "");
        }

    });
    $('#data_icon').click(function () {

        if ($(".t_panel_layer").hasClass('show')) {
            hidePanel(".t_panel_layer", "#l_img", "#layer_icon");
            changeIcon(maptype, "#l_image", "layer", "");
        }
        if ($(".t_panel_maps").hasClass('show')) {
            hidePanel(".t_panel_maps", "#b_img", "#basemap_icon");
            changeIcon(maptype, "#b_image", "map", "");
        }

        if ($(this).hasClass('show')) {
            changeIcon(maptype, "#l_image", "layer", "");
            changeIcon(maptype, "#b_image", "map", "");
            showPanel(".t_panel", "#d_img", "#data_icon");
            changeIcon(maptype, "#d_image", "download", "green");
        }
        else {

            hidePanel(".t_panel", "#d_img", "#data_icon");
            changeIcon(maptype, "#d_image", "download", "");
        }
    });
    $('#basemap_icon').click(function () {
        if ($(".t_panel_layer").hasClass('show')) {
            hidePanel(".t_panel_layer", "#l_img", "#layer_icon");
            changeIcon(maptype, "#l_image", "layer", "");

        }
        if ($(".t_panel").hasClass('show')) {
            hidePanel(".t_panel", "#d_img", "#data_icon");
            changeIcon(maptype, "#d_image", "download", "");
        }
        if ($(this).hasClass('show')) {
            showPanel(".t_panel_maps", "#b_img", "#basemap_icon");
            changeIcon(maptype, "#l_image", "layer", "");
            changeIcon(maptype, "#d_image", "download", "");
            changeIcon(maptype, "#b_image", "map", "green");
        }
        else {
            hidePanel(".t_panel_maps", "#b_img", "#basemap_icon");
            changeIcon(maptype, "#b_image", "map", "");
        }
    });
    $('#layer_icon').click(function () {
        if ($(".t_panel_maps").hasClass('show')) {
            hidePanel(".t_panel_maps", "#b_img", "#basemap_icon");
            changeIcon(maptype, "#b_image", "map", "");
        }
        if ($(".t_panel").hasClass('show')) {
            hidePanel(".t_panel", "#d_img", "#data_icon");
            changeIcon(maptype, "#d_image", "download", "");
        }

        if ($(this).hasClass('show')) {
            DisplayLayersUI();
            showPanel(".t_panel_layer", "#l_img", "#layer_icon");
            changeIcon(maptype, "#b_image", "map", "");
            changeIcon(maptype, "#d_image", "download", "");
            changeIcon(maptype, "#l_image", "layer", "green");
        }
        else {

            hidePanel(".t_panel_layer", "#l_img", "#layer_icon");
            changeIcon(maptype, "#l_image", "layer", "");
        }
    });
});
function test1() {
    if ($("#popup_SelectData_Calculations_ToolTip1").css("display") == "none") {

    }
    else {
        if (document.getElementById("tt1").style.display == "none") {
            document.getElementById("tt1").style.display = "block";
        }
        else
            document.getElementById("tt1").style.display = "none";


        // Later in the script - Show it but only If it's not visible.  

    }
}
function test() {
    if ($("#popup_SelectData_DataSource_ToolTip1").css("display") == "none") {
    }
    else {

        if (document.getElementById("tt2").style.display == "none") {
            document.getElementById("tt2").style.display = "block";
        }
        else {
            document.getElementById("tt2").style.display = "none";
        }


        // Later in the script - Show it but only If it's not visible.  

    }

}
function tt_close() {
    $("#tt1").hide();
    $("#tt2").hide();
}
function doAction() {
    var select = document.getElementById("selectAction");
    var selectedString = select.options[select.selectedIndex].value;

    if (selectedString == "0Ac") {
        $("#selectmenu").hide();
        event_GetStarted_DrawCustomPoly_Button_Clicked();
    }
    else if (selectedString == "1Ac") {
        $("#selectmenu").show();
        event_GetStarted_ChooseFeatureOnMap_Button_Clicked();
    }
    else if (selectedString == "2Ac") {
        $("#selectmenu").hide();
        event_GetStarted_LoadGeoJSONFile_Button_Clicked();
    }
}
function doAreaAction() {
    event_SelectArea_StartSelectingFromMap();
}
function downloadClicked() {
    myOpVal6 = "6";
    event_SelectData_SubmitJob_Button_Clicked();
}
function generateClicked() {
    myOpVal6 = "999";
    event_SelectData_SubmitJob_Button_Clicked();

}

function search() {

    var input, filter, ul, li, a, i, mlist, menubox, menuboxstyle;
    input = document.getElementById("myInput");
    ul = document.getElementById("toggle");
    mlist = ul.getElementsByTagName("div");
    filter = input.value;
    if (filter.length == 0) {
        for (var k = 0; k < mlist.length; k++) {
            li = mlist[k].getElementsByTagName("div");
            for (i = 0; i < li.length; i++) {
                li[i].style.display = "block";
                for (var j = 0; j < li[i].getElementsByTagName("div").length; j++) {
                    li[i].getElementsByTagName("div")[j].style.visibility = "hidden";
                    $(li[i].getElementsByTagName("div")[j]).slideUp();

                } 

            }
        }
    }
    else {

        for (var k = 0; k < mlist.length; k++) {
            li = mlist[k].getElementsByTagName("div");
            for (i = 0; i < li.length; i++) {
                a = li[i].className;

               
                     if (a.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
                        if (/[a-zA-Z]/.test(filter)) {
                            li[i].style.display = "block";
                        }
                        else break;

                    } 
                else {
                    li[i].style.display = "none";
                }
            }
        }
    }

}