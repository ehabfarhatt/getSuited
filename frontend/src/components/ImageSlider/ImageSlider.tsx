import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageSlider.css";

interface ImageSlide {
  src: string;
  heading: string;
  buttonText: string;
  link: string;
}

interface Props {
  images: ImageSlide[];
}

const ImageSlider: React.FC<Props> = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slider-container">
      {images.map((img, index) => (
        <div
          key={index}
          className={`slide ${index === current ? "active" : ""}`}
        >
          <img src={img.src} alt={`Slide ${index}`} />
          <div className="overlay">
            <h2>{img.heading}</h2>
            <button onClick={() => navigate(img.link)}>{img.buttonText}</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;
