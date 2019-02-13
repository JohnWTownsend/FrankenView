var constraints = {
    audio: true,
}

var currentVolume = 0;
var barLineElem;
let volumeLevelText;
let positionText;
let positionX = 0;
let positionY = 0;
let positionZ = 100;

document.addEventListener("DOMContentLoaded", () => {
    barLineElem1 = document.querySelector("#barLine1");
    positionText = document.querySelector("#position");
    volumeLevelText = document.querySelector("#volumeLevel");
    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            setUpMediaStream(mediaStream);
        })
        .catch((err) => {
            console.log(err.name + ": " + err.message);
        });
    let updateVisualInterval = setInterval(()=>{
        updateVisual(barLineElem1);
        updateVolumeLevelText()
        
        }, 20);
    setInterval(updatePositionText,250);
    // setUpVideoStream();
});



function updateVisual(barLineElem) {
    let barElem = document.createElement("div");
    barElem.setAttribute("class", "bar");
    barElem.setAttribute("style", `height:${Math.round(currentVolume)}%; `);//border:1px solid ${randomColor()};
    barLineElem.appendChild(barElem);
    let numOfBars = 50
    let barElems = barLineElem.querySelectorAll(".bar");
    if (barElems.length > numOfBars) {
        let elemsToDelete = [...barElems].slice(0, length - numOfBars);
        elemsToDelete.forEach((elem) => {
            elem.remove();
        });
    }

    if (Math.round(currentVolume) >= 40) {
        lightning();
    }
}
function updateVolumeLevelText(){
    volumeLevelText.innerHTML = currentVolume.toFixed(3) + "%";
}

function updatePositionText(){
    let r1 = Math.floor(Math.random()*100000)%100+1;
    let r2 = Math.floor(Math.random()*100000)%100+1;
    positionText.innerHTML = `x:${positionX} y:${positionY} z: ${positionZ}`;
    if(r1%3 === 0)
        positionX += 1
    else if(r1%3 === 1)
        positionX -= 1

    if(r2%3 === 0)
        positionY += 1
    else if(r2%3 === 1)
        positionY -= 1

    if(r2%10 === 0){
        if(r1%2 === 0)
            positionZ += 1
        else
            positionZ -= 1
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

        currentVolume = average
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
