import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Edit, X } from 'lucide-react'; // Importing icons from lucide-react
import toast from 'react-hot-toast'; // Importing react-hot-toast

const UserProfilePage = () => {
    // --- Demo Data: Your real user data should be loaded here ---
    const [userData, setUserData] = useState({
        name: 'Sajid User',
        email: 'sajid.user@example.com',
        phone: '017xxxxxxxx',
        address: 'Dhaka, Bangladesh',
        memberSince: 'January 2021',
    });

    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        // Implement save logic here (API call)
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    };

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