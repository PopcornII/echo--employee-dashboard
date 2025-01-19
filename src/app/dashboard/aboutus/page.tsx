

import React from 'react';
import Image from 'next/image';
import Avatar from 'antd/es/avatar/avatar';


interface AvatarProps {
    src: string;
    alt: string;
}

const AboutUs: React.FC<AvatarProps> = () => {
  
  return (
    <>
      <div className="relative text-center justify-center">
      </div>
      <p className="text-lg text-gray-700 px-6 py-4 text-center">
        Welcome to TC Computer, your trusted destination for all things tech! With a passion for innovation and a commitment to customer satisfaction, we strive to provide top-quality products and expert service to meet your computing needs. Behind this amazing website are dedicated teams whose passion drives us forward. Let's delve deeper and get to know them.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <img className="w-24 h-24 rounded-full mb-4" src="../../../../public/images.png" alt="Hean Thanin" />
          <h3 className="text-xl font-semibold">Hean Thanin</h3>
          <h4 className="text-gray-600">Software Engineer</h4>
        </div>
        <div className="flex flex-col items-center text-center">
          <img className="w-24 h-24 rounded-full mb-4" src='../../../../public/images.png' alt="Sok Rithy" />
          <h3 className="text-xl font-semibold">Sok Rithy</h3>
          <h4 className="text-gray-600">Software Engineer</h4>
        </div>
        <div className="flex flex-col items-center text-center">
          <img className="w-24 h-24 rounded-full mb-4" src='../../../../public/images.png' alt="Hom Hea" />
          <h3 className="text-xl font-semibold">Hom Hea</h3>
          <h4 className="text-gray-600">Software Engineer</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 pb-8">
        <div className="flex flex-col items-center text-center">
          <img className="w-24 h-24 rounded-full mb-4" src='../../../../public/images.png' alt="Hout Penhey" />
          <h3 className="text-xl font-semibold">Hout Penhey</h3>
          <h4 className="text-gray-600">Software Engineer</h4>
        </div>
        <div className="flex flex-col items-center text-center">
          <img className="w-24 h-24 rounded-full mb-4" src='../../../../public/images.png' alt="Rady Rithiya" />
          <h3 className="text-xl font-semibold">Rady Rithiya</h3>
          <h4 className="text-gray-600">Software Engineer</h4>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
