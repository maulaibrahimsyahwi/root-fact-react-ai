import { useRef, useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import CameraSection from "./components/CameraSection";
import InfoPanel from "./components/InfoPanel";
import { useAppState } from "./hooks/useAppState";

function App() {
  const { state, services, actions } = useAppState();
  const detectionCleanupRef = useRef(null);
  const isRunningRef = useRef(false);
  const lastFrameTimeRef = useRef(0);
  const isInitializedRef = useRef(false);
  const [currentTone, setCurrentTone] = useState("normal");

  const initializeServices = useCallback(async () => {
    try {
      actions.setModelStatus("loading");

      const handleVisionProgress = (val) => actions.setLoadingProgress(val);
      const handleNlpProgress = (val) => actions.setLoadingProgress(val);

      await services.detection.loadModel(handleVisionProgress);
      await services.rootFacts.loadModel(handleNlpProgress);

      actions.setModelStatus("ready");
    } catch (error) {
      actions.setError(error.message);
      actions.setModelStatus("error");
    }
  }, [actions, services]);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeServices();
    }

    return () => {
      if (detectionCleanupRef.current) {
        cancelAnimationFrame(detectionCleanupRef.current);
      }
      if (services.camera) {
        services.camera.stop();
      }
    };
  }, [initializeServices, services]);

  const detectionLoop = async (timestamp) => {
    if (
      !isRunningRef.current ||
      !services.detection.isLoaded() ||
      !services.camera.videoElement
    )
      return;

    const delay = 1000 / state.fpsLimit;

    if (timestamp - lastFrameTimeRef.current >= delay) {
      lastFrameTimeRef.current = timestamp;

      try {
        const result = await services.detection.predict(
          services.camera.videoElement,
        );

        if (result && result.score > 0.6) {
          actions.setDetectionResult(result);

          if (state.appState !== "generating" && services.rootFacts.isReady()) {
            actions.setAppState("generating");
            const fact = await services.rootFacts.generateFacts(result.label);
            actions.setFunFactData({ text: fact, tone: currentTone });
            actions.setAppState("idle");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (isRunningRef.current) {
      detectionCleanupRef.current = requestAnimationFrame(detectionLoop);
    }
  };

  const toggleCamera = async () => {
    if (state.isRunning) {
      services.camera.stop();
      isRunningRef.current = false;
      if (detectionCleanupRef.current) {
        cancelAnimationFrame(detectionCleanupRef.current);
      }
      actions.setIsRunning(false);
    } else {
      try {
        await services.camera.start();
        isRunningRef.current = true;
        actions.setIsRunning(true);
        lastFrameTimeRef.current = performance.now();
        detectionCleanupRef.current = requestAnimationFrame(detectionLoop);
      } catch (error) {
        actions.setError("Failed to access camera");
      }
    }
  };

  const handleToneChange = (newTone) => {
    setCurrentTone(newTone);
    services.rootFacts.setTone(newTone);
  };

  const handleFpsChange = (newFps) => {
    actions.setFpsLimit(Number(newFps));
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
      <Header
        modelStatus={state.modelStatus}
        progress={state.loadingProgress}
      />

      <main className="main-content">
        <CameraSection
          isRunning={state.isRunning}
          services={services}
          modelStatus={state.modelStatus}
          error={state.error}
          currentTone={currentTone}
          currentFps={state.fpsLimit}
          onToggleCamera={toggleCamera}
          onToneChange={handleToneChange}
          onFpsChange={handleFpsChange}
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
    </div>
  );
}

export default App;
