var constraints = {
    audio: true,
}

var currentVolume = 0;
var barLineElem;


document.addEventListener("DOMContentLoaded", () => {
    barLineElem1 = document.querySelector("#barLine1");

    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            setUpMediaStream(mediaStream);
        })
        .catch((err) => {
            console.log(err.name + ": " + err.message);
        });
    let updateVisualInterval = setInterval(()=>{
        updateVisual(barLineElem1);
        }, 20);
    setUpVideoStream();
});

function updateVisual(barLineElem) {
    let barElem = document.createElement("div");
    barElem.setAttribute("class", "bar");
    barElem.setAttribute("style", `height:${currentVolume}%; border:1px solid ${randomColor()};`);
    barLineElem.appendChild(barElem);
    let numOfBars = 50
    let barElems = barLineElem.querySelectorAll(".bar");
    if (barElems.length > numOfBars) {
        let elemsToDelete = [...barElems].slice(0, length - numOfBars);
        elemsToDelete.forEach((elem) => {
            elem.remove();
        });
    }

    if (currentVolume >= 40) {
        lightning();
    }
}

function randomColor(){
    r = Math.floor(Math.random()*255);
    g = Math.floor(Math.random()*255);
    b = Math.floor(Math.random()*255);
    return `rgb(${r},${g},${b})`;
}

function lightning() {
    for (var i = 0; i < 100; i++) {
        let x = Math.floor(Math.random() * 1000 % 10 + 1);
        barLineElem.setAttribute("style", `background:yellow`);
        setTimeout(() => {
            barLineElem.setAttribute("style", `background:black`);
        }, x * 300);
    }
}
function setUpMediaStream(mediaStream) {
    let audioContext = new AudioContext();
    let analyzer = audioContext.createAnalyser();
    let microphone = audioContext.createMediaStreamSource(mediaStream);
    let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

    analyzer.smoothingTimeConstant = 0.8;
    analyzer.fftSize = 1024;

    microphone.connect(analyzer);
    analyzer.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
    javascriptNode.onaudioprocess = () => {
        var array = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(array);
        var values = 0;

        var length = array.length;
        for (var i = 0; i < length; i++) {
            values += (array[i]);
        }

        var average = values / length;

        currentVolume = Math.round(average)
    };
}
function setUpVideoStream() {
    var video = document.querySelector("#videoElement");

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                video.srcObject = stream;
            })
            .catch(function (err0r) {
                console.log("Something went wrong!");
            });
    }
}
