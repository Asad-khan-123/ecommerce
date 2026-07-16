import React, { useState, useEffect } from 'react';

interface FadeInImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

const FadeInImage: React.FC<FadeInImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  wrapperClassName = '',
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Reset loaded state when image source changes to trigger new fade-in
    setLoaded(false);
  }, [src]);

  return (
    <div className={`relative w-full h-full ${wrapperClassName}`}>
      {/* Light shimmer placeholder background while image is loading in browser memory */}
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity duration-300 ease-in-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default FadeInImage;
