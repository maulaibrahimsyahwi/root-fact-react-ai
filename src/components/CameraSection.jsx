import React, { useRef, useEffect } from "react";

export default function CameraSection({
  isRunning,
  services,
  modelStatus,
  error,
  currentTone,
  currentFps,
  onToggleCamera,
  onToneChange,
  onFpsChange,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (services.camera && videoRef.current) {
      services.camera.videoElement = videoRef.current;
    }
  }, [services.camera]);

  return (
    <section className="camera-section">
      <div className="camera-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ display: isRunning ? "block" : "none" }}
        />
        {!isRunning && (
          <div className="camera-placeholder">
            {modelStatus === "loading"
              ? "Inisialisasi Model..."
              : "Kamera Nonaktif"}
          </div>
        )}
      </div>

      <div className="controls">
        <button
          onClick={onToggleCamera}
          disabled={modelStatus === "loading" || !!error}
        >
          {isRunning ? "Matikan Kamera" : "Nyalakan Kamera"}
        </button>

        <select
          value={currentTone}
          onChange={(e) => onToneChange(e.target.value)}
          disabled={modelStatus === "loading"}
        >
          <option value="normal">Gaya: Normal</option>
          <option value="funny">Gaya: Lucu</option>
          <option value="historical">Gaya: Sejarah</option>
        </select>

        <select
          value={currentFps}
          onChange={(e) => onFpsChange(e.target.value)}
          disabled={modelStatus === "loading"}
        >
          <option value="2">Limit: 2 FPS</option>
          <option value="5">Limit: 5 FPS</option>
          <option value="10">Limit: 10 FPS</option>
        </select>
      </div>
    </section>
  );
}
