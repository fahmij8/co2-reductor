import { getData, postData } from "./app-antares.js";
import { Toast } from "./app-display.js";

const setupVideos = async () => {
    Toast.fire({
        icon: "info",
        title: "Preparing. Don't switch tabs!",
    });

    let lastIP = await getData(2);
    let streamUrl = `http://${lastIP.IP}`;
    const faceImagesPath = "./assets/images/";
    const modelPath = "./assets/models/";
    const faceLabels = ["Fahmi"];
    const distanceLimit = 0.6;
    let faceImagesCount = 2;
    let labeledFaceDescriptors;
    let faceMatcher;
    let ShowImage = document.getElementById("stream");
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    let myTimer;
    let restartCount = 0;

    Promise.all([faceapi.nets.faceLandmark68Net.load(modelPath), faceapi.nets.faceRecognitionNet.load(modelPath), faceapi.nets.ssdMobilenetv1.load(modelPath)]).then(() => {
        prepLabeledImage();
    });

    let prepLabeledImage = async () => {
        labeledFaceDescriptors = await loadLabeledImages();
        faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, distanceLimit);
        Toast.fire({
            icon: "info",
            title: "All set!",
        });
        showVideo();
    };

    let showVideo = () => {
        clearInterval(myTimer);
        myTimer = setInterval(() => {
            error_handle();
        }, 6000);
        ShowImage.src = streamUrl + "/capture?_cb=" + Math.random();
    };

    let error_handle = () => {
        restartCount++;
        clearInterval(myTimer);
        if (restartCount <= 2) {
            myTimer = setInterval(() => {
                showVideo();
            }, 4000);
        } else {
            console.log("error!");
        }
    };

    ShowImage.onload = () => {
        clearInterval(myTimer);
        restartCount = 0;
        canvas.setAttribute("width", ShowImage.width);
        canvas.setAttribute("height", ShowImage.height);
        context.drawImage(ShowImage, 0, 0, ShowImage.width, ShowImage.height);
        canvas.style.width = "100%";
        recognizeImage();
    };

    let recognizeImage = async () => {
        let displaySize = { width: canvas.width, height: canvas.height };
        const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
        results.forEach((result, i) => {
            let box = resizedDetections[i].detection.box;
            let drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
            drawBox.draw(canvas);
            if (result["_label"] === "unknown") {
                //canvas.toDataURL
            }
        });

        try {
            setTimeout(() => {
                showVideo();
            }, 100);
        } catch (e) {
            console.log(e);
            setTimeout(() => {
                showVideo();
            }, 200);
        }
    };

    let loadLabeledImages = () => {
        Toast.fire({
            icon: "info",
            title: "Hang on, almost there!",
        });
        try {
            return Promise.all(
                faceLabels.map(async (label) => {
                    const descriptions = [];
                    for (let i = 1; i <= faceImagesCount; i++) {
                        console.log(`Train images ${i}`);
                        const img = await faceapi.fetchImage(faceImagesPath + label + "/" + i + ".jpg");
                        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                        descriptions.push(detections.descriptor);
                    }
                    return new faceapi.LabeledFaceDescriptors(label, descriptions);
                })
            );
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "Something happen, please contact administrator",
            });
            console.error(error);
        }
    };
};

export { setupVideos };
