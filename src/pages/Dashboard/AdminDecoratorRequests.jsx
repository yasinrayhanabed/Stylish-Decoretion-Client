import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import { FaUserPlus, FaCheck, FaTimes, FaEye, FaPhone, FaMapMarkerAlt, FaStar, FaPalette } from 'react-icons/fa';

export default function AdminDecoratorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await API.get('/decorator-requests');
      setRequests(response.data || []);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
      setRequests([]);
      toast.error('Failed to load decorator requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this decorator request?')) return;
    
    setProcessingId(requestId);
    try {
      await API.put(`/decorator-requests/${requestId}/approve`);
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: 'approved' } : req
      ));
      toast.success('Decorator request approved successfully!');
    } catch (err) {
      console.error('Failed to approve request:', err);
      toast.error('Failed to approve request. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this decorator request?')) return;
    
    setProcessingId(requestId);
    try {
      await API.put(`/decorator-requests/${requestId}/reject`);
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status: 'rejected' } : req
      ));
      toast.success('Decorator request rejected.');
    } catch (err) {
      console.error('Failed to reject request:', err);
      toast.error('Failed to reject request. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center">
              <FaUserPlus className="mr-3" />
              Decorator Requests
            </h1>
            <p className="text-blue-100 text-lg">Review and manage decorator applications</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaPalette className="text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-yellow-600 mb-1">Pending Requests</div>
              <div className="text-3xl font-bold text-yellow-800">
                {requests.filter(req => req.status === 'pending').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <FaUserPlus className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-green-600 mb-1">Approved</div>
              <div className="text-3xl font-bold text-green-800">
                {requests.filter(req => req.status === 'approved').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaCheck className="text-2xl text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-red-600 mb-1">Rejected</div>
              <div className="text-3xl font-bold text-red-800">
                {requests.filter(req => req.status === 'rejected').length}
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FaTimes className="text-2xl text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaUserPlus className="text-4xl text-gray-400" />
            </div>
            <h4 className="text-2xl font-bold text-gray-700 mb-3">No Decorator Requests</h4>
            <p className="text-gray-500 text-lg">No users have applied to become decorators yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request._id}
                className="bg-gradient-to-r from-white to-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {request.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {request.user?.name || 'Unknown User'}
                        </h3>
                        <p className="text-gray-600">{request.user?.email || 'No email'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center text-blue-600 font-medium mb-1">
                          <FaStar className="mr-2" />
                          Experience
                        </div>
                        <div className="text-blue-900 font-bold">{request.experience || 'Not specified'}</div>
                      </div>
                      
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="flex items-center text-purple-600 font-medium mb-1">
                          <FaPalette className="mr-2" />
                          Specialty
                        </div>
                        <div className="text-purple-900 font-bold">{request.specialty || 'Not specified'}</div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center text-green-600 font-medium mb-1">
                          <FaPhone className="mr-2" />
                          Contact
                        </div>
                        <div className="text-green-900 font-bold">{request.phone || 'Not provided'}</div>
                      </div>
                    </div>

                    {request.location && (
                      <div className="flex items-center text-gray-600 mb-3">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{request.location}</span>
                      </div>
                    )}

                    {request.description && (
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
                        <p className="text-gray-600 text-sm">{request.description}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {request.status === 'approved' ? '✅ Approved' : 
                           request.status === 'rejected' ? '❌ Rejected' : 
                           '⏳ Pending'}
                        </span>
                        
                        {request.expectedRate && (
                          <span className="text-sm text-gray-600">
                            Expected Rate: <span className="font-bold">৳{request.expectedRate}</span>
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        Applied: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {request.portfolio && (
                      <a
                        href={request.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center text-sm font-medium"
                      >
                        <FaEye className="mr-2" />
                        Portfolio
                      </a>
                    )}

                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(request._id)}
                          disabled={processingId === request._id}
                          className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center text-sm font-medium disabled:opacity-50"
                        >
                          <FaCheck className="mr-2" />
                          {processingId === request._id ? 'Processing...' : 'Approve'}
                        </button>
                        
                        <button
                          onClick={() => handleReject(request._id)}
                          disabled={processingId === request._id}
                          className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center text-sm font-medium disabled:opacity-50"
                        >
                          <FaTimes className="mr-2" />
                          {processingId === request._id ? 'Processing...' : 'Reject'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}