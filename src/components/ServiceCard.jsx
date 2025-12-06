import React from 'react';
import { Link } from 'react-router-dom';
export default function ServiceCard({ service }){
  return (
    <div className="card bg-base-100 shadow">
      <figure><img src={service.images?.[0] || 'https://placehold.co/600x400'} alt={service.service_name} /></figure>
      <div className="card-body">
        <h2 className="card-title">{service.service_name}</h2>
        <p>{service.category} • {service.unit}</p>
        <div className="card-actions justify-between items-center">
          <div className="text-lg font-semibold">BDT {service.cost}</div>
          <Link className="btn btn-sm btn-primary" to={`/services/${service._id}`}>Details</Link>
        </div>
      </div>
    </div>
  );
}
