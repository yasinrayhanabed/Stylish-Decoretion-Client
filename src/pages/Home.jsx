import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import TopDecorators from '../components/TopDecorators';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Spinner from '../components/Spinner';

export default function Home(){
  const [services, setServices] = useState(null);

  
  useEffect(()=> {
    const fetchData = async () => {
      try {
        const servicesRes = await API.get('/services');
        setServices(servicesRes.data);
      } catch (error) {
        setServices([]);
        setDecorators([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero min-h-screen bg-gradient-to-r from-purple-600 to-blue-600"
      >
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <motion.h1 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl font-bold mb-5"
            >
              Transform Your Space with StyleDecor
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8 text-xl"
            >
              Professional decoration services for homes, weddings, and events. Book consultations and on-site services with expert decorators.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link to="/services" className="btn btn-primary btn-lg mr-4">
                Book Decoration Service
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-purple-600">
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-base-100 to-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
               Our Popular Services
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Discover our most loved decoration services, crafted with expertise and passion
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full"></div>
          </motion.div>
          
          {services === null ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Spinner />
                <p className="text-base-content/60">Loading amazing services...</p>
              </div>
            </div>
          ) : services.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <h3 className="text-2xl font-bold mb-2">Services Coming Soon!</h3>
              <p className="text-base-content/70">We're preparing amazing decoration services for you</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {services.slice(0, 6).map((service, index) => (
                <ServiceCard key={service._id} service={service} index={index} />
              ))}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link 
              to="/services" 
              className="btn btn-primary btn-lg hover:btn-secondary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
               Explore All Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Top Decorators Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary to-accent bg-clip-text text-transparent mb-4">
               আমাদের সেরা ডেকোরেটরদের সাথে পরিচিত হন
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              রেটিং অনুযায়ী সেরা পেশাদার ডেকোরেটর যারা আপনার স্বপ্নকে বাস্তবে রূপ দিতে প্রস্তুত
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary to-accent mx-auto mt-6 rounded-full"></div>
          </motion.div>
          <TopDecorators />
        </div>
      </section>

      {/* Service Coverage Map */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Service Coverage Area</h2>
          <div className="h-96 rounded-lg shadow-lg overflow-hidden">
            <MapContainer center={[23.8103, 90.4125]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[23.8103, 90.4125]}>
                <Popup>
                  <div className="text-center">
                    <strong>StyleDecor Service Area</strong><br />
                    Dhaka & Surrounding Areas
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  );
}