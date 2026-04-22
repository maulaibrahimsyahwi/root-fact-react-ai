import { useState } from "react";
import { DetectionService } from "../services/DetectionService";
import { RootFactsService } from "../services/RootFactsService";
import { CameraService } from "../services/CameraService";

export function useAppState() {
  const [state, setState] = useState({
    modelStatus: "idle",
    isRunning: false,
    appState: "idle",
    detectionResult: null,
    funFactData: null,
    error: null,
    services: {
      detection: new DetectionService(),
      rootFacts: new RootFactsService(),
      camera: new CameraService(),
    },
  });

  const actions = {
    setModelStatus: (status) =>
      setState((s) => ({ ...s, modelStatus: status })),
    setIsRunning: (isRunning) => setState((s) => ({ ...s, isRunning })),
    setAppState: (appState) => setState((s) => ({ ...s, appState })),
    setDetectionResult: (detectionResult) =>
      setState((s) => ({ ...s, detectionResult })),
    setFunFactData: (funFactData) => setState((s) => ({ ...s, funFactData })),
    setError: (error) => setState((s) => ({ ...s, error })),
  };

  return { state, actions };
}
