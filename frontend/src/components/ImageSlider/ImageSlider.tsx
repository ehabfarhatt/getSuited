// src/components/ImageSlider/ImageSlider.tsx
import React, { useEffect, useState } from "react";
import "./ImageSlider.css";
import { useNavigate } from "react-router-dom";

interface Slide {
  src: string;
  link: string;
  alt?: string;
}

interface ImageSliderProps {
  images: Slide[];
  autoSlideInterval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, autoSlideInterval = 2000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [images.length, autoSlideInterval]);

  const handleClick = () => {
    navigate(images[currentIndex].link);
  };

  return (
    <div className="image-slider" onClick={handleClick}>
      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].alt || "Slide"}
        className="slide-image"
      />
    </div>
  );
};

export default ImageSlider;