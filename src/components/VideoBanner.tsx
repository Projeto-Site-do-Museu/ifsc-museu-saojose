import React from "react";

interface VideoBannerProps {
  src: string;
  poster?: string;
  aspect?: string; // Ex: "aspect-video" ou "aspect-[16/6]"
  className?: string;
}

const VideoBanner: React.FC<VideoBannerProps> = ({
  src,
  poster,
  aspect = "aspect-video",
  className = "",
}) => (
      <video
        className="w-full h-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
);

export default VideoBanner;