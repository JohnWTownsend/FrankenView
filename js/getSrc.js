document.addEventListener("DOMContentLoaded", ()=>{
    let vstream = document.querySelector("#video-stream");
    vstream.src = getUrlVars().src;
});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
