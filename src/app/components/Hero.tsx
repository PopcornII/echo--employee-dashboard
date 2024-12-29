import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
  placeholderText?: string;
  buttonText?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, placeholderText = "you@example.com", buttonText = "Submit" }) => {
  return (
    <section className="bg-gray-200 text-center py-20">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-lg text-gray-600">{subtitle}</p>
      <div className="mt-6 flex justify-center">
        <input
          type="email"
          placeholder={placeholderText}
          className="px-4 py-2 border border-gray-300 rounded-l w-64 focus:outline-none"
        />
        <button className="px-4 py-2 bg-black text-white rounded-r hover:bg-gray-800">
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default Hero;
