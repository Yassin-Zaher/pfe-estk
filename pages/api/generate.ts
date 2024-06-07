// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { prompt } = await req.body;

    const image = await openai.images.generate({
      prompt: "A cute baby sea otter",
      model: "dall-e-2",
      n: 1,
    });

    return res.json({ data: image.data });
  } catch (err) {
    if (err.response) {
      console.error(err.response.data.error.message);
      return res
        .status(err.response.status)
        .json({ error: err.response.data.error.message });
    } else {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
  }
}
