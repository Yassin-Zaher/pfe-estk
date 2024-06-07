import { useUploadThing } from "@/lib/uploadthing";
import { exportToPdf } from "../../../lib/utils";
import { Button } from "../ui/button";
import { startTransition } from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { imgUrls } from "@/lib/utils";

const Export = ({ fabricRef }) => {
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      console.log("Data");
      console.log(data);
      const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/configure/preview?id=${configId}`);
      });
    },
  });

  // @ts-ignore
  /* async function saveConfiguration() {
    try {
      console.log("Saving the design in the cloud");

      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = imageRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffset = caseTop - containerTop;

      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffset;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimension.width,
        renderedDimension.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", { type: "image/png" });

      await startUpload([file], { configId });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description:
          "There was a problem saving your config, please try again.",
        variant: "destructive",
      });
    }
  } */

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const convertCanvasToPng = () => {
    const imageFiles = [];

    const prevFrontImage = fabricRef.current._objects.find((o) =>
      imgUrls.includes(o.src)
    );

    if (prevFrontImage) {
      const { left, top, width, height } = prevFrontImage.getBoundingRect();

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = fabricRef.current.width;
      tempCanvas.height = fabricRef.current.height;
      const tempCtx = tempCanvas.getContext("2d");
      //fabricRef.current
      tempCtx.drawImage(
        fabricRef.current.getElement(),
        left,
        top,
        width,
        height,
        0,
        0,
        width,
        height
      );

      const image = tempCanvas.toDataURL("image/png");
      downloadImage(image, "exported-image.png");
      const file = dataURLtoFile(image, "canvas-image.png");
      imageFiles.push(file);
    }

    return imageFiles;
  };

  const downloadImage = (data, filename = "untitled.png") => {
    const a = document.createElement("a");
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImageSave = () => {
    const imagesFile = convertCanvasToPng();
    const acceptedFiles = imagesFile || [];
    //console.log(imageFile);

    //startUpload(acceptedFiles, { configId: undefined, custom: true });
  };

  const convertCanvasToPngDirect = () => {
    const canvasElement = fabricRef.current.getElement();

    // Get the image data URL from the canvas
    const image = canvasElement.toDataURL("image/png");

    // Convert the data URL to a file
    var aDownloadLink = document.createElement("a");
    // Add the name of the file to the link
    aDownloadLink.download = "canvas_image.png";
    // Attach the data to the link
    aDownloadLink.href = image;
    // Get the code to click the download link
    aDownloadLink.click();

    const file = dataURLtoFile(image, "canvas-image.png");
    const acceptedFiles = [file];

    startUpload(acceptedFiles, { configId: undefined, custom: true });
  };

  return (
    <div className="flex flex-col gap-3 px-5 py-3">
      <h3 className="text-[10px] uppercase">Export</h3>
      <Button
        className="w-full border border-canvas-grey-100 hover:bg-canvas-green hover:text-canvas-black"
        onClick={convertCanvasToPngDirect}
      >
        Export to PDF
      </Button>
    </div>
  );
};

export default Export;
