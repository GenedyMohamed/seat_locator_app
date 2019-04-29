import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myphoto: any;
  click: any;
  video = document.getElementById("myvideo");
  canvas = document.getElementById("canvas");
  // context = this.canvas.getContext("2d");
  trackButton = document.getElementById("trackbutton");
  updateNote = 'loading model ..';

  isVideo = false;
  model = null;

  modelParams = {
    flipHorizontal: true,   // flip e.g for video
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
  }
  // Load the model.

  constructor(public navCtrl: NavController, private camera: Camera, private cameraPreview: CameraPreview) {
    this.click = 0;
  }
  // startVideo(){
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }
  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64 (DATA_URL):
  //     this.myphoto = 'data:image/jpeg;base64,' + imageData;
  //    }, (err) => {
  //     // Handle error
  //     this.myphoto = err
  //    });
  // }

  startVideo() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'rear',
      tapPhoto: true,
      previewDrag: true,
      toBack: true,
      alpha: 1
    };
    // start camera
    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      });
  }
  toggleVideo() {
    if (!this.isVideo) {
      this.updateNote = "Starting video"
      this.startVideo();
    } else {
      this.updateNote = "Stopping video"
      // this.handTrack.stopVideo(this.video)
      this.isVideo = false;
      this.updateNote = "Video stopped"
    }
  }
  runDetection() {
    this.model.detect(this.video).then(predictions => {
      console.log("Predictions: ", predictions);
      // this.model.renderPredictions(predictions, this.canvas, this.context, this.video);
      if (this.isVideo) {
        requestAnimationFrame(this.runDetection);
      }
    });
  }
}
