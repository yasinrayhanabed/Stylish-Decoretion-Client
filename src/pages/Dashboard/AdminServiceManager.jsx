import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaUsers, FaRobot, FaCrown, FaSms, FaGift, FaCog, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { subscriptionPlans } from '../../utils/subscriptionUtils';
import { getDecoratorRecommendations, getMultipleDecoratorsForEvent } from '../../utils/aiRecommendation';
import { sendSMS, smsTemplates } from '../../utils/smsUtils';
import { serviceAddons } from '../../utils/serviceAddons';

export default function AdminServiceManager() {
  const [activeTab, setActiveTab] = useState('locations');
  const [locations, setLocations] = useState([
    { id: 1, name: 'Dhaka Central', address: 'Gulshan, Dhaka', active: true, services: 15 },
    { id: 2, name: 'Chittagong Branch', address: 'Agrabad, Chittagong', active: true, services: 8 },
    { id: 3, name: 'Sylhet Office', address: 'Zindabazar, Sylhet', active: false, services: 5 }
  ]);
  
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, userId: 'user123', plan: 'premium', status: 'active', remainingServices: 3, nextBilling: '2024-02-15' },
    { id: 2, userId: 'user456', plan: 'basic', status: 'active', remainingServices: 1, nextBilling: '2024-02-20' }
  ]);

  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    // Load AI recommendations
    const recommendations = getDecoratorRecommendations({
      serviceType: 'home',
      budget: 'medium',
      style: 'modern'
    });
    setAiRecommendations(recommendations);
  }, []);

  const handleLocationUpdate = (locationId, updates) => {
    setLocations(prev => prev.map(loc => 
      loc.id === locationId ? { ...loc, ...updates } : loc
    ));
    toast.success('Location updated successfully');
  };

  const sendBulkSMS = async (message, recipients = 'all') => {
    try {
      await sendSMS('+8801234567890', message, 'bulk_notification');
      toast.success(`Bulk SMS sent to ${recipients} users`);
    } catch (err) {
      toast.error('Failed to send bulk SMS');
    }
  };

  const renderLocationsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Multi-Location Management</h3>
        <button 
          onClick={() => setShowLocationModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Location
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map(location => (
          <div key={location.id} className="bg-white rounded-lg shadow-lg p-6 border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-lg">{location.name}</h4>
                <p className="text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-1" /> {location.address}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                location.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {location.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">Services Available: <span className="font-bold">{location.services}</span></p>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setEditingLocation(location)}
                className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 flex items-center justify-center"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
              <button 
                onClick={() => handleLocationUpdate(location.id, { active: !location.active })}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center ${
                  location.active 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {location.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubscriptionsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Subscription Management</h3>
      
      {/* Subscription Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {subscriptionPlans.map(plan => (
          <div key={plan.id} className={`bg-white rounded-lg shadow-lg p-6 border-2 ${
            plan.popular ? 'border-purple-500' : 'border-gray-200'
          }`}>
            {plan.popular && (
              <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
                Most Popular
              </div>
            )}
            <h4 className="font-bold text-xl mb-2">{plan.name}</h4>
            <p className="text-3xl font-bold text-purple-600 mb-4">৳{plan.price}<span className="text-sm text-gray-500">/{plan.duration}</span></p>
            <ul className="space-y-2 text-sm">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="font-bold text-lg mb-4">Active Subscriptions</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">User ID</th>
                <th className="text-left py-2">Plan</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Remaining Services</th>
                <th className="text-left py-2">Next Billing</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(sub => (
                <tr key={sub.id} className="border-b">
                  <td className="py-2">{sub.userId}</td>
                  <td className="py-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-2">{sub.remainingServices}</td>
                  <td className="py-2">{sub.nextBilling}</td>
                  <td className="py-2">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => sendBulkSMS(smsTemplates.subscriptionReminder(sub.plan, sub.nextBilling))}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <FaSms />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAITab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center">
        <FaRobot className="mr-2 text-blue-500" /> AI Decorator Recommendations
      </h3>
      
      {aiRecommendations && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <p className="text-gray-600 mb-2">{aiRecommendations.reasoning}</p>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              aiRecommendations.confidence === 'high' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {aiRecommendations.confidence} confidence
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiRecommendations.recommendations.map(decorator => (
              <div key={decorator.id} className="border rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <img 
                    src={decorator.photo} 
                    alt={decorator.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-bold">{decorator.name}</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm ml-1">{decorator.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Experience:</strong> {decorator.experience} years</p>
                  <p><strong>Projects:</strong> {decorator.completedProjects}</p>
                  <p><strong>AI Score:</strong> {decorator.aiScore}%</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {decorator.specialties.map(specialty => (
                      <span key={specialty} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multiple Decorators for Large Events */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="font-bold text-lg mb-4">Multiple Decorators for Large Events</h4>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-bold mb-2">Benefits of Multiple Decorators:</h5>
          <ul className="space-y-1 text-sm">
            <li>• Faster setup and completion (40% time reduction)</li>
            <li>• Specialized expertise for different areas</li>
            <li>• Better coordination for large events</li>
            <li>• Backup support if needed</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Recommended for events with 100+ guests or multiple service areas
          </p>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center">
        <FaSms className="mr-2 text-green-500" /> SMS Notifications
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="font-bold text-lg mb-4">Quick SMS Templates</h4>
          <div className="space-y-3">
            <button 
              onClick={() => sendBulkSMS(smsTemplates.serviceUpdate('Home Decoration'))}
              className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <strong>Service Update</strong>
              <p className="text-sm text-gray-600">Notify about service updates</p>
            </button>
            <button 
              onClick={() => sendBulkSMS(smsTemplates.couponCode('STYLE25', 25, '2024-12-31'))}
              className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <strong>Coupon Promotion</strong>
              <p className="text-sm text-gray-600">Send promotional offers</p>
            </button>
            <button 
              onClick={() => sendBulkSMS('New services now available in your area! Book now for special launch prices.')}
              className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <strong>New Service Launch</strong>
              <p className="text-sm text-gray-600">Announce new services</p>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="font-bold text-lg mb-4">SMS Statistics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Messages Sent Today</span>
              <span className="font-bold text-blue-600">127</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Delivery Rate</span>
              <span className="font-bold text-green-600">98.5%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>Response Rate</span>
              <span className="font-bold text-purple-600">15.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <h1 className="text-4xl font-bold mb-2">Advanced Service Management</h1>
        <p className="text-purple-100 text-lg">Comprehensive admin tools for service operations</p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-xl mb-6">
        <div className="flex flex-wrap border-b">
          {[
            { id: 'locations', label: 'Multi-Location', icon: FaMapMarkerAlt },
            { id: 'subscriptions', label: 'Subscriptions', icon: FaCrown },
            { id: 'ai', label: 'AI Recommendations', icon: FaRobot },
            { id: 'notifications', label: 'SMS Notifications', icon: FaSms }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-8">
          {activeTab === 'locations' && renderLocationsTab()}
          {activeTab === 'subscriptions' && renderSubscriptionsTab()}
          {activeTab === 'ai' && renderAITab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Add New Location</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Location Name"
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Available Services"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  toast.success('Location added successfully');
                  setShowLocationModal(false);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Location
              </button>
              <button
                onClick={() => setShowLocationModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add subscription reminder template
smsTemplates.subscriptionReminder = (plan, nextBilling) => 
  `Subscription Reminder: Your ${plan} plan will renew on ${nextBilling}. Manage your subscription anytime!`;