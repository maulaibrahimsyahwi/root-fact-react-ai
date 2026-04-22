import { useState, useMemo, useRef } from "react";
import { DetectionService } from "../services/DetectionService";
import { RootFactsService } from "../services/RootFactsService";
import { CameraService } from "../services/CameraService";

export function useAppState() {
  const servicesRef = useRef({
    detection: new DetectionService(),
    rootFacts: new RootFactsService(),
    camera: new CameraService(),
  });

  const [state, setState] = useState({
    modelStatus: "idle",
    loadingProgress: 0,
    isRunning: false,
    appState: "idle",
    detectionResult: null,
    funFactData: null,
    error: null,
    fpsLimit: 5,
  });

  const actions = useMemo(
    () => ({
      setModelStatus: (status) =>
        setState((s) => ({ ...s, modelStatus: status })),
      setLoadingProgress: (progress) =>
        setState((s) => ({ ...s, loadingProgress: progress })),
      setIsRunning: (isRunning) => setState((s) => ({ ...s, isRunning })),
      setAppState: (appState) => setState((s) => ({ ...s, appState })),
      setDetectionResult: (detectionResult) =>
        setState((s) => ({ ...s, detectionResult })),
      setFunFactData: (funFactData) => setState((s) => ({ ...s, funFactData })),
      setError: (error) => setState((s) => ({ ...s, error })),
      setFpsLimit: (limit) => setState((s) => ({ ...s, fpsLimit: limit })),
    }),
    [],
  );

  return { state, services: servicesRef.current, actions };
}
