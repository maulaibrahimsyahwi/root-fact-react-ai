import React from "react";

export default function InfoPanel({
  appState,
  detectionResult,
  funFactData,
  onCopy,
}) {
  return (
    <section className="info-panel">
      {detectionResult && (
        <div className="result-card">
          <h2>Sayuran Terdeteksi: {detectionResult.label}</h2>
          <p style={{ margin: 0, color: "var(--text-muted)" }}>
            Tingkat Kepercayaan: {(detectionResult.score * 100).toFixed(1)}%
          </p>
        </div>
      )}

      {appState === "generating" && (
        <p style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
          Sedang menyusun fakta menarik...
        </p>
      )}

      {funFactData && appState !== "generating" && (
        <div className="fact-card">
          <h3>Fun Fact ({funFactData.tone}):</h3>
          <p>{funFactData.text}</p>
          <button onClick={() => onCopy(funFactData.text)}>
            Salin ke Papan Klip
          </button>
        </div>
      )}
    </section>
  );
}
