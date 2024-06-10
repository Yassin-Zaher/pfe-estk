"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const GenerateModel = ({ startUpload }) => {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({ prediction });
      setPrediction(prediction);
    }
  };

  const handleUpload = () => {
    fetch(prediction.output[prediction.output.length - 1])
      .then((response) => response.blob())
      .then((blob) => {
        // Create a File object from the Blob
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });

        // Pass the File object to startUpload
        startUpload([file], { configId: undefined });
      })
      .catch((error) => {
        console.error("Error fetching or converting image:", error);
      });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Generate ✨</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Image Generator</DialogTitle>
          <DialogDescription>
            Generate an image using Generative AI by describing what you want to
            see
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-x-2">
          <form className="w-full" onSubmit={handleSubmit}>
            <Textarea
              type="text"
              className="flex-grow"
              name="prompt"
              placeholder="What do you want to see!"
            />
            <Button className="mt-1" type="submit">
              Go!
            </Button>
          </form>

          {error && <div className="text-red">{error}</div>}

          {prediction && (
            <>
              {prediction.output && (
                <div className="mt-3 flex flex-col justify-center items-center">
                  <img
                    className="h-[200px] w-[250px]"
                    src={prediction.output[prediction.output.length - 1]}
                    alt="output"
                  />
                  <div className="m-2">
                    <DialogClose asChild>
                      <Button
                        onClick={handleUpload}
                        type="button"
                        variant="secondary"
                      >
                        Upload
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              )}
              <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                status: {prediction.status}
              </span>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
