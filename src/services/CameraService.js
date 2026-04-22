export class CameraService {
  constructor() {
    this.videoElement = null;
    this.stream = null;
  }

  async start() {
    if (!this.videoElement) {
      throw new Error("Video element is not set");
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      this.videoElement.srcObject = this.stream;

      return new Promise((resolve) => {
        this.videoElement.onloadedmetadata = () => {
          resolve();
        };
      });
    } catch (error) {
      throw error;
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }
}
