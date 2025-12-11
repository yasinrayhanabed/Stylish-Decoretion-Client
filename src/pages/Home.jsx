import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Spinner from '../components/Spinner';

export default function Home(){
  const [services, setServices] = useState(null);
  const [decorators, setDecorators] = useState([]);
  
  useEffect(()=> {
    const fetchData = async () => {
      try {
        const [servicesRes, decoratorsRes] = await Promise.all([
          API.get('/services'),
          API.get('/decorators').catch(() => ({ data: [] }))
        ]);
        setServices(servicesRes.data);
        setDecorators(decoratorsRes.data.slice(0, 4));
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
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Popular Services</h2>
          {services === null ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 6).map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/services" className="btn btn-outline btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Top Decorators Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Meet Our Top Decorators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {decorators.length > 0 ? decorators.map((decorator) => (
              <motion.div
                key={decorator._id}
                whileHover={{ y: -5 }}
                className="card bg-base-100 shadow-xl"
              >
                <figure className="px-6 pt-6">
                  <img
                    src={decorator.photo || "https://i.pravatar.cc/150"}
                    alt={decorator.name}
                    className="rounded-full w-24 h-24 object-cover"
                  />
                </figure>
                <div className="card-body text-center">
                  <h3 className="card-title justify-center">{decorator.name}</h3>
                  <p className="text-sm text-gray-600">{decorator.specialty || 'Decoration Expert'}</p>
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input key={i} type="radio" className="mask mask-star-2 bg-orange-400" defaultChecked={i < 4} disabled />
                    ))}
                  </div>
                </div>
              </motion.div>
            )) : (
              [...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="card bg-base-100 shadow-xl"
                >
                  <figure className="px-6 pt-6">
                    <img
                      src={`https://i.pravatar.cc/150?img=${i + 1}`}
                      alt={`Decorator ${i + 1}`}
                      className="rounded-full w-24 h-24 object-cover"
                    />
                  </figure>
                  <div className="card-body text-center">
                    <h3 className="card-title justify-center">Expert Decorator</h3>
                    <p className="text-sm text-gray-600">Decoration Specialist</p>
                    <div className="rating rating-sm">
                      {[...Array(5)].map((_, j) => (
                        <input key={j} type="radio" className="mask mask-star-2 bg-orange-400" defaultChecked={j < 4} disabled />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
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