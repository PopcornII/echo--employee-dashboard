import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imagePlaceholder?: string;
}

const Card: React.FC<CardProps> = ({ title, description, imagePlaceholder = "Image Placeholder" }) => {
  return (
    <div className="border border-gray-300 bg-white shadow rounded p-4 text-center">
      <div className="h-32 bg-gray-200 mb-4 flex justify-center items-center">
        <span className="text-gray-500">{imagePlaceholder}</span>
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default Card;
