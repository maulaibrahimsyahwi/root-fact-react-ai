import React from "react";

export default function Header({ modelStatus }) {
  return (
    <header
      style={{
        padding: "1rem",
        textAlign: "center",
        borderBottom: "1px solid #ccc",
        marginBottom: "2rem",
      }}
    >
      <h1 style={{ margin: "0 0 0.5rem 0" }}>Root Fact App</h1>
      <div
        style={{
          fontSize: "0.9rem",
          color: modelStatus === "ready" ? "green" : "orange",
        }}
      >
        Status Sistem: {modelStatus.toUpperCase()}
      </div>
    </header>
  );
}
