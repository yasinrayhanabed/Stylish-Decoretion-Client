import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Save, Edit, X } from 'lucide-react'; // Importing icons from lucide-react
import toast from 'react-hot-toast'; // Importing react-hot-toast
import useAuth from '../../hooks/useAuth';

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
            // TODO: Implement API call to update user profile
            // await API.put('/users/profile', userData);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            // Refetch user data to get updated info
            refetchUser();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        }
    };

    // Show loading or no user message
    if (!user) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg my-10">
                <div className="text-center py-8">
                    <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">No User Data Found</h2>
                    <p className="text-gray-500">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg my-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
                <User className="w-7 h-7 mr-3 text-indigo-600" /> User Profile
            </h1>

            <div className="space-y-4">
                {/* Name Field */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-600 w-24">Name:</span>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={userData.name} 
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                            className="flex-grow input input-bordered input-sm"
                        />
                    ) : (
                        <span className="text-gray-900 flex-grow">{userData.name}</span>
                    )}
                </div>

                {/* Email Field */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-600 w-24">Email:</span>
                    <span className="text-gray-900 flex-grow">{userData.email}</span>
                </div>

                {/* Phone Field */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-600 w-24">Phone:</span>
                    {isEditing ? (
                        <input 
                            type="tel" 
                            value={userData.phone} 
                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            className="flex-grow input input-bordered input-sm"
                        />
                    ) : (
                        <span className="text-gray-900 flex-grow">{userData.phone}</span>
                    )}
                </div>

                {/* Address Field */}
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-600 w-24">Address:</span>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={userData.address} 
                            onChange={(e) => setUserData({...userData, address: e.target.value})}
                            className="flex-grow input input-bordered input-sm"
                        />
                    ) : (
                        <span className="text-gray-900 flex-grow">{userData.address}</span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
                {isEditing ? (
                    <>
                        <button 
                            onClick={handleSave} 
                            className="btn btn-success text-white flex items-center"
                        >
                            <Save className="w-5 h-5 mr-2" /> Save Changes
                        </button>
                        <button 
                            onClick={() => setIsEditing(false)} 
                            className="btn btn-ghost flex items-center"
                        >
                            <X className="w-5 h-5 mr-2" /> Cancel
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="btn btn-primary text-white flex items-center"
                    >
                        <Edit className="w-5 h-5 mr-2" /> Edit Profile
                    </button>
                )}
            </div>

            <div className="mt-6 pt-4 border-t text-sm text-gray-500 text-right">
                Member Since: {userData.memberSince}
            </div>
        </div>
    );
};

export default UserProfilePage;