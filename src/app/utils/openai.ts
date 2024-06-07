export const IMAGE_MODEL = "dall-e-2";

const OpenAI = require("openai");

const openai = new OpenAI({
  key: "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",
});

export default openai;
