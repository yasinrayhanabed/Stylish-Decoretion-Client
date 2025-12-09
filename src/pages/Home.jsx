import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Spinner from '../components/Spinner';

export default function Home(){
  const [services, setServices] = useState(null);
  useEffect(()=> {
    API.get('/services').then(r => {
      const items = r.data.results || r.data;
      setServices(items);
    }).catch(()=> setServices([]));
  }, []);

  return (
    <div>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="hero bg-base-200 rounded-xl p-10 mb-8">
        <div className="hero-content flex-col lg:flex-row">
          <div>
            <h1 className="text-4xl font-bold">StyleDecor — Your event, our magic</h1>
            <p className="py-6">Book consultations & on-site decoration with top decorators nearby.</p>
            <a className="btn btn-primary" href="/services">Book Decoration Service</a>
          </div>
          <div className="w-full lg:w-1/2">
            <img src="https://ibb.co.com/x46Xj2q" alt="style-decor" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </motion.div>

      <section className='py-10'>
        <h2 className="text-gray-50 font-bold text-3xl mb-4">Popular Services</h2>
        {services === null ? <Spinner/> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.slice(0,6).map(s => <ServiceCard key={s._id} service={s} />)}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-3xl text-gray-50 font-bold mb-4">Service Coverage Map</h2>
        <div className="h-72 rounded shadow">
          <MapContainer center={[23.8103,90.4125]} zoom={13} style={{height:'100%'}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[23.8103,90.4125]}>
              <Popup>Dhaka Service Coverage</Popup>
            </Marker>
          </MapContainer>
        </div>
      </section>
    </div>
  );
}
