import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import * as handTrack from 'handtrackjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myphoto: any;
  click: any;
  video = document.getElementById("myvideo");
  canvas = <HTMLCanvasElement> document.getElementById("mycanvas");
  //context = this.canvas.getContext("2d");
  // context = this.canvas.getContext("2d");
  trackButton = <HTMLInputElement>document.getElementById("trackbutton");

  updateNote: any;

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
    handTrack.startVideo(this.video).then(function (status) {
      console.log("video started", status);
      if (status) {
          this.updateNote = "Video started. Now tracking"
          this.isVideo = true
          this.runDetection()
      } else {
          this.updateNote = "Please enable video"
      }
  });
  // Load the model.
handTrack.load(this.modelParams).then(lmodel => {
  // detect objects in the image.
  this.model = lmodel
  this.updateNote = "Loaded Model!"
  this.trackButton.disabled = false
  });
  }
    // const cameraPreviewOpts: CameraPreviewOptions = {
    //   x: 0,
    //   y: 0,
    //   width: window.screen.width,
    //   height: window.screen.height,
    //   camera: 'rear',
    //   tapPhoto: false,
    //   previewDrag: false,
    //   toBack: false,
    //   alpha: 1
    // };
    // // start camera
    // this.cameraPreview.startCamera(cameraPreviewOpts).then(
    //   (res) => {
    //     console.log(res)
    //   },
    //   (err) => {
    //     console.log(err)
    //   });
   toggleVideo() {
    if (!this.isVideo) {
      this.updateNote = "Starting video"
      this.startVideo();
    } else {
      this.updateNote = "Stopping video"
        handTrack.stopVideo(this.video)
        this.isVideo = false;
        this.updateNote = "Video stopped"
    }
}

 runDetection() {
  this.model.detect(this.video).then(predictions => {
      console.log("Predictions: ", predictions);
      this.model.renderPredictions(predictions, this.canvas, this.video);
      if (this.isVideo) {
          requestAnimationFrame(this.runDetection);
      }
  });
}

}
