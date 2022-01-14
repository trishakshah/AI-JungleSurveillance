statusVar = "";
inputText = "";
resultsArray = [];
model = "";

function preload() {
    video = createVideo("tigerVideo.mp4")
}

function setup() {
    canvas = createCanvas(650, 400);
    canvas.center();
    video.hide();
}

function startSurveillance() {
    model = ml5.objectDetector("cocossd", modelLoaded);
    document.getElementById("output").innerHTML = "Detecting wildlife...";
    inputText = document.getElementById("input").value;
}

function modelLoaded() {
    console.log("Model loaded.");
    statusVar = true;
    video.volume(0);
    video.loop();
}

function getResults(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        resultsArray = results;
    }
}

function draw() {
    image(video, 0, 0, 650, 400);
    if (statusVar != "") {
        model.detect(video, getResults);
        for (i = 0; i < resultsArray.length; i++) {
            confidence = floor(resultsArray[i].confidence * 100) + "% sure";
            label = resultsArray[i].label;
            stroke("red");
            text(label + " " + confidence, resultsArray[i].x, resultsArray[i].y);
            noFill();
            rect(resultsArray[i].x, resultsArray[i].y, resultsArray[i].width, resultsArray[i].height);
        }
    }
    if (inputText == label) {
        video.stop();
        model.detect(getResults);
        document.getElementById("output").innerHTML = "Object found.";
        synthesizer = window.speechSynthesis;
        speech = new SpeechSynthesisUtterance("We found a " + inputText + " in the jungle cam!");
        synthesizer.speak(speech);
    } else {
        document.getElementById("output").innerHTML = "Object not found.";
    }
}