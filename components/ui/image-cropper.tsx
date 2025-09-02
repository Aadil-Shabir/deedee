"use client";

import { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImageCropperProps {
  image: string;
  aspect?: number;
  circularCrop?: boolean;
  onCropComplete: (croppedImageUrl: string) => void;
  onClose: () => void;
}

export function ImageCropper({
  image,
  aspect = 1,
  circularCrop = false,
  onCropComplete,
  onClose,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const getCroppedImg = () => {
    if (!imgRef.current) return;

    let pixelCrop = completedCrop;
    if (!pixelCrop || !pixelCrop.width || !pixelCrop.height) {
      if (!crop.width || !crop.height) return;

      const image = imgRef.current;
      pixelCrop = {
        x: (crop.x / 100) * image.width,
        y: (crop.y / 100) * image.height,
        width: (crop.width / 100) * image.width,
        height: (crop.height / 100) * image.height,
        unit: "px",
      } as PixelCrop;
    }

    const canvas = document.createElement("canvas");
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Convert canvas to blob and then to a URL
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);

        // Create a FileReader to convert the blob to a data URL for uploading
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            // Provide the data URL to the parent component
            onCropComplete(reader.result);
          } else {
            console.error("Failed to convert blob to data URL");
            onCropComplete(croppedImageUrl); // Fallback to object URL
          }
        };
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      0.95
    ); // Use higher quality JPEG
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="relative max-h-[90vh] max-w-[90vw] overflow-auto rounded-lg bg-card p-6 shadow-xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <h3 className="mb-4 text-xl font-semibold">Crop Image</h3>

        <div className="mb-6 rounded-md bg-muted/30 p-1">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            circularCrop={circularCrop}
            className={circularCrop ? "rounded-full overflow-hidden" : ""}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop preview"
              className="max-h-[60vh]"
            />
          </ReactCrop>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={getCroppedImg}>Apply Crop</Button>
        </div>
      </div>
    </div>
  );
}
