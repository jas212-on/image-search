import React from "react";

export const ImageCard = ({ image, isSelected, onToggle }) => {
  return (
    <div
      className="relative group cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-lg transition border border-gray-200"
      onClick={onToggle}
    >
      <img
        src={image.urls.regular}
        alt={image.description}
        className="w-full h-64 object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 transition">
        {/* Checkbox */}
        <div className="absolute top-3 right-3">
          <div
            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
              isSelected
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-300"
            }`}
          >
            {isSelected && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Image Title */}
      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4">
        <p className="text-white font-medium">{image.title}</p>
      </div>
    </div>
  );
};

export default ImageCard;