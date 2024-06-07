import { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";

export const runtime = "nodejs";
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
