import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-webgpu";

export class DetectionService {
  constructor() {
    this.model = null;
    this.labels = [];
    this.config = null;
  }

  async loadModel(onProgress) {
    try {
      if (navigator.gpu) {
        await tf.setBackend("webgpu");
      } else {
        await tf.setBackend("webgl");
      }
      await tf.ready();

      this.model = await tf.loadLayersModel("/model/model.json", {
        onProgress: (fraction) => {
          if (onProgress) onProgress(Math.round(fraction * 100));
        },
      });

      const response = await fetch("/model/metadata.json");
      this.config = await response.json();
      this.labels = this.config.labels;
    } catch (error) {
      throw error;
    }
  }

  async predict(imageElement) {
    if (!this.model) return null;

    return tf.tidy(() => {
      let img = tf.browser.fromPixels(imageElement);
      img = tf.image.resizeBilinear(img, [224, 224]);
      img = img.expandDims(0);
      img = img.div(255.0);

      const predictions = this.model.predict(img);
      const scores = predictions.dataSync();
      const maxScoreIndex = predictions.argMax(1).dataSync()[0];

      return {
        label: this.labels[maxScoreIndex],
        score: scores[maxScoreIndex],
      };
    });
  }

  isLoaded() {
    return this.model !== null;
  }
}
