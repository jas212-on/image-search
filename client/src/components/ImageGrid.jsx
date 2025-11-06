import React from "react";
import ImageCard from './ImageCard';
import LoadingSkeleton from './LoadingSkeleton';

export const ImageGrid = ({ images, selectedImages, toggleImageSelection, isLoadingImages }) => {
  if (isLoadingImages) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, idx) => (
        <ImageCard
          key={image.id + idx}
          image={image}
          isSelected={selectedImages.has(image.id)}
          onToggle={() => toggleImageSelection(image.id)}
        />
      ))}
    </div>
  );
};

export default ImageGrid;