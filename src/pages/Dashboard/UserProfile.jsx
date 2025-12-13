import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaUser, FaEdit, FaSave, FaTimes, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserTag, FaCalendarAlt } from 'react-icons/fa';

const UserProfilePage = () => {
    const { user, refetchUser } = useAuth();
    
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        memberSince: '',
    });
    
    // Load user data when component mounts or user changes
    useEffect(() => {
        if (user) {
            setUserData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                memberSince: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                }) : 'N/A',
            });
        }
    }, [user]);

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        try {
            await API.put('/users/profile', {
                name: userData.name,
                phone: userData.phone,
                address: userData.address
            });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            refetchUser();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        }
    };

    if (!user) {
        return (
            <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUser className="text-3xl text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No User Data Found</h2>
                <p className="text-base-content/70">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="card-title text-3xl flex items-center">
                            <FaUser className="mr-3 text-primary" /> My Profile
                        </h2>
                        {!isEditing && (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="btn btn-primary"
                            >
                                <FaEdit className="mr-2" /> Update Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center">
                                        <FaUser className="mr-2 text-sm" /> Name
                                    </span>
                                </label>
                                <input 
                                    type="text" 
                                    value={userData.name}
                                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                                    className="input input-bordered" 
                                    required
                                />
                            </div>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center">
                                        <FaEnvelope className="mr-2 text-sm" /> Email
                                    </span>
                                </label>
                                <input 
                                    type="email" 
                                    value={userData.email}
                                    className="input input-bordered" 
                                    disabled
                                />
                                <label className="label">
                                    <span className="label-text-alt text-warning">Email cannot be changed</span>
                                </label>
                            </div>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center">
                                        <FaPhone className="mr-2 text-sm" /> Phone
                                    </span>
                                </label>
                                <input 
                                    type="tel" 
                                    value={userData.phone}
                                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                    className="input input-bordered" 
                                />
                            </div>
                            
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-sm" /> Address
                                    </span>
                                </label>
                                <textarea 
                                    value={userData.address}
                                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                                    className="textarea textarea-bordered" 
                                    rows="3"
                                ></textarea>
                            </div>
                            
                            <div className="flex gap-2 justify-end">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="btn btn-ghost"
                                >
                                    <FaTimes className="mr-2" /> Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="btn btn-primary"
                                >
                                    <FaSave className="mr-2" /> Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center">
                                            <FaUser className="mr-2 text-sm text-primary" /> Name
                                        </span>
                                    </label>
                                    <p className="text-lg">{userData.name || 'Not provided'}</p>
                                </div>
                                
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center">
                                            <FaEnvelope className="mr-2 text-sm text-primary" /> Email
                                        </span>
                                    </label>
                                    <p className="text-lg">{userData.email || 'Not provided'}</p>
                                </div>
                                
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center">
                                            <FaPhone className="mr-2 text-sm text-primary" /> Phone
                                        </span>
                                    </label>
                                    <p className="text-lg">{userData.phone || 'Not provided'}</p>
                                </div>
                                
                                <div>
                                    <label className="label">
                                        <span className="label-text font-semibold flex items-center">
                                            <FaUserTag className="mr-2 text-sm text-primary" /> Role
                                        </span>
                                    </label>
                                    <div className="badge badge-primary">{user?.role || 'user'}</div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="label">
                                    <span className="label-text font-semibold flex items-center">
                                        <FaMapMarkerAlt className="mr-2 text-sm text-primary" /> Address
                                    </span>
                                </label>
                                <p className="text-lg">{userData.address || 'Not provided'}</p>
                            </div>
                            
                            <div className="divider"></div>
                            
                            <div className="text-sm text-base-content/70">
                                <span className="font-semibold flex items-center">
                                    <FaCalendarAlt className="mr-2 text-sm text-primary" /> Member Since:
                                </span> {userData.memberSince}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfilePage;