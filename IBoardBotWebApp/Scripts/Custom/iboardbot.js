var path_array = [];
var drawing = false;
var eraser_on = 0;
var appid = "677B3BAFA518D518";
var iwb_maxx;
var iwb_maxy;
var scalefactor = 1.0;

//$(document).ready(start);


function orientupdate() {
    ctx.canvas.width = $(document).width() - 5;
    ctx.canvas.height = ($(document).width() - 5) * (iwb_maxy / iwb_maxx);
    scalefactor = iwb_maxx * 10 / ctx.canvas.width;

}

function add_events() {
    document.addEventListener('mousedown', mouseclick_event, false);
    document.addEventListener('mousemove', mousemove_event, false);
    document.addEventListener('mouseup', mouseup_event, false);

    document.addEventListener('touchstart', touchstart_event, false);
    document.addEventListener('touchmove', touchmove_event, false);
    document.addEventListener('touchend', touchend_event, false);
}

function remove_events() {
    document.removeEventListener('mousedown', mouseclick_event, false);
    document.removeEventListener('mousemove', mousemove_event, false);
    document.removeEventListener('mouseup', mouseup_event, false);

    document.removeEventListener('touchstart', touchstart_event, false);
    document.removeEventListener('touchmove', touchmove_event, false);
    document.removeEventListener('touchend', touchend_event, false);
}

function start() {


    mycanvas = document.getElementById('canvas');
    ctx = mycanvas.getContext('2d');
    iwb_maxx = 358;
    iwb_maxy = 120;

    ctx.canvas.width = $(document).width() - 5;
    ctx.canvas.height = ($(document).width() - 5) * (iwb_maxy / iwb_maxx);

    scalefactor = iwb_maxx * 10 / ctx.canvas.width;

    // subscribe to rotationchange event
    $(window).on("orientationchange", function (event) { orientupdate(); });

   
    CloseModal("ereaseboard");
}

function mouseclick_event(event) {
    if ((event.clientX < canvas.width) && (event.clientY < canvas.height)) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(event.clientX, event.clientY);
        path_array = [];
        var coordx = event.clientX * scalefactor;
        path_array.push(coordx);
        var coordy = iwb_maxy * 10 - event.clientY * scalefactor;
        path_array.push(coordy);
    }
}

function mousemove_event(event) {
    if ((drawing) && (event.clientX < canvas.width) && (event.clientY < canvas.height)) {
        if (eraser_on) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 10;
        }
        else {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
        }
        ctx.lineTo(event.clientX, event.clientY);
        ctx.stroke();
        var coordx = event.clientX * scalefactor;
        path_array.push(coordx);
        var coordy = iwb_maxy * 10 - event.clientY * scalefactor;
        path_array.push(coordy);
    }
}

function mouseup_event(capturo) {
    //alert(ctx.canvas.width);
    //alert(358);
    if (drawing) {
        ctx.closePath();
        drawing = false;
        //appid = "677B3BAFA518D518";
        //alert (path_array.length);
        var parameters = {
            "APPID": appid,
            "path[]": path_array,
            "eraser": eraser_on,
            "finish": 0
        };
        $.post("http://ibbapp.jjrobots.com/pPath.php", parameters, function (data) {
            //alert("Sended!");
            //alert(path_array);
            //alert(data);
        });
    }
}

function touchstart_event(e) {
    var touch = e.targetTouches[0];
    if ((touch.pageX < canvas.width) && (touch.pageY < canvas.height)) {
        //e.preventDefault();
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(touch.pageX, touch.pageY);
        path_array = [];
        var coordx = touch.pageX * scalefactor;
        path_array.push(coordx);
        var coordy = iwb_maxy * 10 - touch.pageY * scalefactor;
        path_array.push(coordy);
    }
}

function touchmove_event(e) {
    if (e.touches.length > 1) {
        // clean path
        path_array = [];
        ctx.closePath();
        drawing = false;
    }
    else {
        var touch = e.targetTouches[0];
        if ((drawing) && (touch.pageX < canvas.width) && (touch.pageY < canvas.height)) {
            e.preventDefault();
            if (eraser_on) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 10;
            }
            else {
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
            }
            ctx.lineTo(touch.pageX, touch.pageY);
            ctx.stroke();
            var coordx = touch.pageX * scalefactor;
            path_array.push(coordx);
            var coordy = iwb_maxy * 10 - touch.pageY * scalefactor;
            path_array.push(coordy);
        }
    }
}

function touchend_event(e) {
    if (drawing) {
        e.preventDefault();
        ctx.closePath();
        drawing = false;
        //appid = "677B3BAFA518D518";
        var parameters = {
            "APPID": appid,
            "path[]": path_array,
            "eraser": eraser_on,
            "finish": 0
        };
        $.post("http://ibbapp.jjrobots.com/pPath.php", parameters, function (data) {
            //alert( "Sended!." );
        });
    }
}

function eraser_function() {
    //alert(eraser.checked);
    if (eraser.checked)
        eraser_on = 1;
    else
        eraser_on = 0;
}

function finish_function() {
    path_array = [];
    var parameters = {
        "APPID": appid,
        "path[]": path_array,
        "eraser": 0,
        "finish": 1
    };
    $.post("http://ibbapp.jjrobots.com/pPath.php", parameters, function (data) { });
    //alert("finish");
}

function clear_function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Clear iboardbot
    var parameters = {
        "APPID": appid,
        "X1": 0,
        "Y1": 0,
        "X2": 358,
        "Y2": 105
    };
    $.post("http://ibbapp.jjrobots.com/pErase.php", parameters, function (data) { });
}

function clear_queue() {

    //Clear queue
    var parameters = {
        "APPID": appid
    };
    $.get("http://ibbapp.jjrobots.com/iwbb_clear.php", parameters, function (data) { });
}

function parse(val) {
    var result = "",
        tmp = [];
    location.search
    .substr(1)
      .split("&")
      .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === val) result = decodeURIComponent(tmp[1]);
      });
    return result;
}

function start_position(event) {
    path_array = [];
    var coordx = 82.35453315290934;
    path_array.push(coordx);
    var coordy = 88.21380243572389;
    path_array.push(coordy);

    var parameters = {
        "APPID": appid,
        "path[]": path_array,
        "eraser": 0,
        "finish": 0
    };
    $.post("http://ibbapp.jjrobots.com/pPath.php", parameters, function (data) {
        //alert("Sended!");
        //alert(path_array);
        //alert(data);
    });

    
}


function erase_function() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    $.ajax({
        url: '/Home/EraseBot',
        type: 'POST',
        //data: { agreeId: agreementId, names: nameArray, values: valueArray, descs: descArray },
        success: function (data) {

        },
        error: function () {
            alert("Erase command failed!");
        }
    });
}