var turl = "", tlyr = "";
var frameRate = 0.5;

function threeHoursAgo() {
    return  new Date("10-22-2017 01:30:00");
}

var startDate = threeHoursAgo();
var frameRate = 0.5;
var animationId = null;


function updateInfo() {
    var el = document.getElementById('info');
    el.innerHTML = startDate.toISOString();
}

function setTime() {
    startDate.setMinutes(startDate.getMinutes() + 180);
    if (startDate > Date.now()) {
        startDate = threeHoursAgo();
    }
    currLayer.getSource().updateParams({ 'TIME': startDate.toISOString() });
    updateInfo();
}
var stop = function () {
    if (animationId !== null) {
        window.clearInterval(animationId);
        animationId = null;
    }
};

var play = function () {
    stop();
    animationId = window.setInterval(setTime, 1000);
};

var startButton = document.getElementById('play');
startButton.addEventListener('click', play, false);

var stopButton = document.getElementById('pause');
stopButton.addEventListener('click', stop, false);



