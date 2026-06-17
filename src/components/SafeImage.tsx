"use client";
import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function SafeImage({ src, alt, width = 400, height = 300, className }: Props) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt ?? "image"}
      width={width}
      height={height}
      className={className}
      onError={() => setImgSrc("/fallback.jpg")}
      unoptimized
    />
  );
}