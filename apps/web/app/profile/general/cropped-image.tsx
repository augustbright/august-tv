import React, { useEffect, useRef } from 'react';
import { Crop } from 'react-image-crop';

export const CroppedImage = ({
  src,
  crop,
  className
}: {
  src: string;
  crop: Crop;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const image = new Image();
    image.src = src;

    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set the canvas dimensions to the crop size
      canvas.width = crop.width;
      canvas.height = crop.height;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the cropped part of the image on the canvas
      ctx.drawImage(
        image, // source image
        crop.x, // x position to start cropping from (in source image)
        crop.y, // y position to start cropping from (in source image)
        crop.width, // width of the cropped area (in source image)
        crop.height, // height of the cropped area (in source image)
        0, // x position to start drawing on the canvas
        0, // y position to start drawing on the canvas
        crop.width, // width of the rendered area on the canvas
        crop.height // height of the rendered area on the canvas
      );
    };
  }, [src, crop]);

  return (
    <canvas
      className={className}
      ref={canvasRef}
    />
  );
};
