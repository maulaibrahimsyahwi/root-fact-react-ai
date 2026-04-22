import React from "react";

export default function InfoPanel({
  appState,
  detectionResult,
  funFactData,
  onCopy,
}) {
  return (
    <section
      className="info-panel"
      style={{
        marginTop: "2rem",
        padding: "1rem",
        borderTop: "1px solid #ccc",
      }}
    >
      {detectionResult && (
        <div style={{ marginBottom: "1rem" }}>
          <h2 style={{ margin: "0 0 0.5rem 0" }}>
            Sayuran Terdeteksi: {detectionResult.label}
          </h2>
          <p style={{ margin: 0 }}>
            Tingkat Kepercayaan: {(detectionResult.score * 100).toFixed(1)}%
          </p>
        </div>
      )}

      {appState === "generating" && (
        <div style={{ fontStyle: "italic", color: "#666" }}>
          <p>Sedang menyusun fakta menarik...</p>
        </div>
      )}

      {funFactData && appState !== "generating" && (
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Fun Fact ({funFactData.tone}):</h3>
          <p style={{ lineHeight: "1.5" }}>{funFactData.text}</p>
          <button
            onClick={() => onCopy(funFactData.text)}
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Salin ke Papan Klip
          </button>
        </div>
      )}
    </section>
  );
}
