import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center px-5 py-20">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-indigo-600 mb-6">About Us</h1>
        <p className="text-lg text-gray-200 mb-4">
          Welcome to <span className="font-semibold">StyleDecor</span>! 
          We are a modern decoration service provider for homes, weddings, and events.
        </p>
        <p className="text-gray-200 mb-4">
          Our mission is to bring your vision to life with smart, stylish, and professional decoration services. 
          We offer in-studio consultations, on-site decorations, and tailored packages to fit every occasion.
        </p>
        <p className="text-gray-200">
          With a team of skilled decorators, modern designs, and attention to detail, we ensure every event is memorable. 
          Explore our services and book your consultation today!
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-700 shadow-lg rounded-xl p-6 hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold mb-2">Professional Team</h3>
          <p className="text-gray-200">Skilled decorators with years of experience to make your events perfect.</p>
        </div>
        <div className="bg-gray-700 shadow-lg rounded-xl p-6 hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold mb-2">Customized Packages</h3>
          <p className="text-gray-200">Tailored services for homes, weddings, parties, and corporate events.</p>
        </div>
        <div className="bg-gray-700 shadow-lg rounded-xl p-6 hover:scale-105 transition-transform">
          <h3 className="text-xl font-semibold mb-2">Smart Scheduling</h3>
          <p className="text-gray-200">Book your service online with real-time availability and tracking.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
