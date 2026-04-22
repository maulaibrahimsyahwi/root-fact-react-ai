import React, { useRef, useEffect } from "react";

export default function CameraSection({
  isRunning,
  services,
  modelStatus,
  error,
  currentTone,
  onToggleCamera,
  onToneChange,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (services.camera && videoRef.current) {
      services.camera.videoElement = videoRef.current;
    }
  }, [services.camera]);

  return (
    <section className="camera-section">
      <div
        className="camera-container"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "500px",
          margin: "0 auto",
          backgroundColor: "#000",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", display: isRunning ? "block" : "none" }}
        />
        {!isRunning && (
          <div
            style={{ padding: "4rem 1rem", textAlign: "center", color: "#fff" }}
          >
            {modelStatus === "loading"
              ? "Menunggu Model AI..."
              : "Kamera Nonaktif"}
          </div>
        )}
      </div>

      <div
        className="controls"
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={onToggleCamera}
          disabled={modelStatus === "loading" || !!error}
          style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
        >
          {isRunning ? "Matikan Kamera" : "Nyalakan Kamera"}
        </button>

        <select
          value={currentTone}
          onChange={(e) => onToneChange(e.target.value)}
          disabled={modelStatus === "loading"}
          style={{ padding: "0.5rem" }}
        >
          <option value="normal">Gaya Bahasa: Normal</option>
          <option value="funny">Gaya Bahasa: Lucu</option>
          <option value="historical">Gaya Bahasa: Sejarah</option>
        </select>
      </div>
    </section>
  );
}
