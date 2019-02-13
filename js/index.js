var constraints = {
    audio: true,
}
let overlay;
let currentVolume = 0;
let barLineElem;
let volumeLevelText;
let positionText;
let positionX = 0;
let positionY = 0;
let positionZ = 100;
let recordDot;
let blip = true;

document.addEventListener("DOMContentLoaded", () => {
    barLineElem1 = document.querySelector("#barLine1");
    positionText = document.querySelector("#position");
    volumeLevelText = document.querySelector("#volumeLevel");
    overlay = document.querySelector("#overlay");
    recordDot = document.querySelector("#recordDot");
    navigator.mediaDevices.getUserMedia(constraints)
        .then((mediaStream) => {
            setUpMediaStream(mediaStream);
        })
        .catch((err) => {
            console.log(err.name + ": " + err.message);
        });
    let updateVisualInterval = setInterval(()=>{
        updateBarVisual(barLineElem1);
        updateVolumeLevelText();
        updateOverlayColor();
        
        }, 20);
    setInterval(updatePositionText,250);
    setInterval(bliprecordDot,2000);
    // setUpVideoStream();
});



function updateBarVisual(barLineElem) {
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

    // if (Math.round(currentVolume) >= 40) {
    //     lightning();
    // }
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

function updateOverlayColor(){
    let bgColor = `background-color:rgba(${Math.round(currentVolume)*5},0,0,0.5)`;
    overlay.setAttribute("style",bgColor);
}

function bliprecordDot(){
    if(blip){
        recordDot.setAttribute("style","visibility:hidden;");
        blip = false;
    }
    else{
        recordDot.setAttribute("style","visibility:visible;");
        blip = true;
    }
}

function randomColor(){
    r = Math.floor(Math.random()*255);
    g = Math.floor(Math.random()*255);
    b = Math.floor(Math.random()*255);
    return `rgb(${r},${g},${b})`;
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
