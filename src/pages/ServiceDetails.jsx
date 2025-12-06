import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Spinner from '../components/Spinner';

export default function ServiceDetails(){
  const { id } = useParams();
  const [service, setService] = useState(null);
  const nav = useNavigate();

  useEffect(()=> {
    API.get(`/services/${id}`).then(r=> setService(r.data)).catch(()=> setService(null));
  }, [id]);

  const handleBook = () => {
    const token = localStorage.getItem('token');
    if(!token) return nav('/login');
    nav(`/booking/${id}`);
  };

  if(service === null) return <Spinner/>;
  if(!service) return <div className="text-center py-10">Service not found</div>;

  return (
    <div className="card lg:card-side bg-base-100 shadow">
      <figure><img src={service.images?.[0] || 'https://placehold.co/800x600'} alt="service" /></figure>
      <div className="card-body">
        <h2 className="card-title">{service.service_name}</h2>
        <p>{service.description}</p>
        <p className="font-semibold">BDT {service.cost} • {service.unit}</p>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={handleBook}>Book Now</button>
        </div>
      </div>
    </div>
  );
}
