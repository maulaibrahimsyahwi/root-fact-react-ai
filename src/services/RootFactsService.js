import { pipeline, env } from "@huggingface/transformers";
import { TONE_CONFIG } from "../utils/config.js";

env.allowLocalModels = false;

export class RootFactsService {
  constructor() {
    this.generator = null;
    this.isModelLoaded = false;
    this.isGenerating = false;
    this.config = null;
    this.currentBackend = null;
    this.currentTone = TONE_CONFIG?.defaultTone || "normal";
  }

  async loadModel() {
    try {
      if (navigator.gpu) {
        env.backends.onnx.wasm.numThreads = 1;
      }
      const device = navigator.gpu ? "webgpu" : "wasm";

      this.generator = await pipeline(
        "text2text-generation",
        "Xenova/LaMini-Flan-T5-783M",
        {
          dtype: "q4",
          device: device,
        },
      );

      this.isModelLoaded = true;
    } catch (error) {
      throw error;
    }
  }

  setTone(tone) {
    this.currentTone = tone;
  }

  async generateFacts(vegetableName) {
    if (!this.isModelLoaded || this.isGenerating) return null;
    this.isGenerating = true;

    try {
      let prompt = `Tell me an interesting fun fact about ${vegetableName}.`;

      if (this.currentTone === "funny") {
        prompt = `Tell me a hilarious and funny fact about ${vegetableName}.`;
      } else if (this.currentTone === "historical") {
        prompt = `Tell me a historical fact about the origin of ${vegetableName}.`;
      }

      const result = await this.generator(prompt, {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
      });

      this.isGenerating = false;
      return result[0].generated_text;
    } catch (error) {
      this.isGenerating = false;
      throw error;
    }
  }

  isReady() {
    return this.isModelLoaded;
  }
}
