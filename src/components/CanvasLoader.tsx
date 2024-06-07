import Image from "next/image";

const CanvasLoader = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
    <Image
      src="/assets/loader.gif"
      alt="loader"
      width={100}
      height={100}
      className="object-contain"
    />
    <p className="text-sm font-bold text-canvas-grey-300">Loading...</p>
  </div>
);

export default CanvasLoader;
