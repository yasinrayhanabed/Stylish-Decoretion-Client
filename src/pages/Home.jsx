import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import FallbackImage from '../components/FallbackImage';
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
               Meet Our Top Decorators
            </h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Talented professionals ready to transform your vision into reality
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary to-accent mx-auto mt-6 rounded-full"></div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {decorators.length > 0 ? decorators.map((decorator, index) => (
              <motion.div
                key={decorator._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.05 }}
                viewport={{ once: true }}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <figure className="px-6 pt-6">
                  <div className="relative">
                    <FallbackImage
                      src={decorator.photo}
                      alt={decorator.name}
                      fallbackSrc={`https://i.pravatar.cc/150?img=${index + 10}`}
                      className="rounded-full w-28 h-28 object-cover border-4 border-primary/20 group-hover:border-primary/60 transition-all duration-300 shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-base-100 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                </figure>
                <div className="card-body text-center pb-6">
                  <h3 className="card-title justify-center text-lg group-hover:text-primary transition-colors">{decorator.name}</h3>
                  <p className="text-sm text-base-content/70 mb-2">{decorator.specialty || 'Decoration Expert'}</p>
                  <div className="rating rating-sm mb-2">
                    {[...Array(5)].map((_, i) => (
                      <input key={i} type="radio" className="mask mask-star-2 bg-warning" defaultChecked={i < 4} disabled />
                    ))}
                  </div>
                  <div className="badge badge-outline badge-sm"> Top Rated</div>
                </div>
              </motion.div>
            )) : (
              [...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  viewport={{ once: true }}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  <figure className="px-6 pt-6">
                    <div className="relative">
                      <FallbackImage
                        src={`https://i.pravatar.cc/150?img=${i + 1}`}
                        alt={`Decorator ${i + 1}`}
                        className="rounded-full w-28 h-28 object-cover border-4 border-primary/20 group-hover:border-primary/60 transition-all duration-300 shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-base-100 flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    </div>
                  </figure>
                  <div className="card-body text-center pb-6">
                    <h3 className="card-title justify-center text-lg group-hover:text-primary transition-colors">Expert Decorator</h3>
                    <p className="text-sm text-base-content/70 mb-2">Decoration Specialist</p>
                    <div className="rating rating-sm mb-2">
                      {[...Array(5)].map((_, j) => (
                        <input key={j} type="radio" className="mask mask-star-2 bg-warning" defaultChecked={j < 4} disabled />
                      ))}
                    </div>
                    <div className="badge badge-outline badge-sm"> Top Rated</div>
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