import { useRef, useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import CameraSection from "./components/CameraSection";
import InfoPanel from "./components/InfoPanel";
import { useAppState } from "./hooks/useAppState";

function App() {
  const { state, actions } = useAppState();
  const detectionCleanupRef = useRef(null);
  const isRunningRef = useRef(false);
  const [currentTone, setCurrentTone] = useState("normal");

  const initializeServices = useCallback(async () => {
    try {
      actions.setModelStatus("loading");
      await Promise.all([
        state.services.detection.loadModel(),
        state.services.rootFacts.loadModel(),
      ]);
      actions.setModelStatus("ready");
    } catch (error) {
      actions.setError(error.message);
      actions.setModelStatus("error");
    }
  }, [actions, state.services]);

  useEffect(() => {
    initializeServices();
    return () => {
      if (detectionCleanupRef.current) {
        cancelAnimationFrame(detectionCleanupRef.current);
      }
      if (state.services.camera) {
        state.services.camera.stop();
      }
    };
  }, [initializeServices, state.services]);

  const detectionLoop = async () => {
    if (
      !isRunningRef.current ||
      !state.services.detection.isLoaded() ||
      !state.services.camera.videoElement
    )
      return;

    try {
      const result = await state.services.detection.predict(
        state.services.camera.videoElement,
      );

      if (result && result.score > 0.6) {
        actions.setDetectionResult(result);

        if (
          state.appState !== "generating" &&
          state.services.rootFacts.isReady()
        ) {
          actions.setAppState("generating");
          const fact = await state.services.rootFacts.generateFacts(
            result.label,
          );
          actions.setFunFactData({ text: fact, tone: currentTone });
          actions.setAppState("idle");
        }
      }
    } catch (error) {
      console.error(error);
    }

    if (isRunningRef.current) {
      detectionCleanupRef.current = requestAnimationFrame(detectionLoop);
    }
  };

  const toggleCamera = async () => {
    if (state.isRunning) {
      state.services.camera.stop();
      isRunningRef.current = false;
      if (detectionCleanupRef.current) {
        cancelAnimationFrame(detectionCleanupRef.current);
      }
      actions.setIsRunning(false);
    } else {
      try {
        await state.services.camera.start();
        isRunningRef.current = true;
        actions.setIsRunning(true);
        detectionLoop();
      } catch (error) {
        actions.setError("Failed to access camera");
      }
    }
  };

  const handleToneChange = (newTone) => {
    setCurrentTone(newTone);
    state.services.rootFacts.setTone(newTone);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      actions.setError("Failed to copy text");
    }
  };

  return (
    <div className="app-container">
      <Header modelStatus={state.modelStatus} />

      <main className="main-content">
        <CameraSection
          isRunning={state.isRunning}
          services={state.services}
          modelStatus={state.modelStatus}
          error={state.error}
          currentTone={currentTone}
          onToggleCamera={toggleCamera}
          onToneChange={handleToneChange}
        />

        <InfoPanel
          appState={state.appState}
          detectionResult={state.detectionResult}
          funFactData={state.funFactData}
          error={state.error}
          onCopy={copyToClipboard}
        />
      </main>

      <footer className="footer">
        <p>Powered by TensorFlow.js & Transformers.js</p>
      </footer>

      {state.error && (
        <div
          style={{
            position: "fixed",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "380px",
            padding: "0.875rem 1rem",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "var(--radius-md)",
            color: "#991b1b",
            fontSize: "0.8125rem",
            boxShadow: "var(--shadow-lg)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 1000,
          }}
        >
          <strong>Error:</strong> {state.error}
          <button
            onClick={() => actions.setError(null)}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              fontSize: "1.25rem",
              cursor: "pointer",
              color: "#991b1b",
              padding: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
