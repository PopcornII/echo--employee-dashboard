import React from 'react';

interface GridItem {
  id: number;
  title: string;
  description: string;
}

interface GridComponentProps {
  data: GridItem[];
}

export default function GridComponent({ data }: GridComponentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white p-4 shadow-md rounded hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-bold mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
