import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ShoppingBag } from 'lucide-react'; // Import icons from lucide-react

const CheckoutPage = () => {
    const navigate = useNavigate();
    
    // --- Demo Data: Your real data should be loaded here ---
    const [billingInfo, setBillingInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('online');

    // Demo Cart Items
    const cartItems = [
        { id: 1, name: 'Premium Event Decoration Package', price: 50000, qty: 1 },
        { id: 2, name: 'Photography & Videography Add-on', price: 15000, qty: 1 },
        { id: 3, name: 'Extra Lighting Setup', price: 5000, qty: 2 },
    ];
    
    // --- Calculation Logic ---
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const taxRate = 0.05; // 5% VAT/Tax
    const tax = subtotal * taxRate;
    const processingFee = 150;
    const total = subtotal + tax + processingFee;

    const formatCurrency = (amount) => `${amount.toLocaleString('en-IN')} BDT`;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // This is only a frontend action.
        // In a real project, you must send data to the server and redirect to the payment gateway.
        
        console.log('Order Data:', { billingInfo, paymentMethod, total });
        
        // Redirect to success page as a demo
        navigate('/payment/success'); 
    };

    // --- Checkout Page Design ---
    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
                    <ShoppingBag className="inline-block w-8 h-8 mr-3 text-indigo-600" />
                    Complete Your Checkout Process
                </h1>

                <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-3 lg:gap-10">
                    
                    {/* Left Column: Address and Payment Info */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* 1. Contact Information */}
                        <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <MapPin className="w-6 h-6 mr-3 text-indigo-500" />
                                Billing & Contact Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    type="text" name="name" placeholder="Full Name" 
                                    value={billingInfo.name} onChange={handleInputChange} 
                                    required 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                                />
                                <input 
                                    type="email" name="email" placeholder="Email" 
                                    value={billingInfo.email} onChange={handleInputChange} 
                                    required 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                                />
                                <input 
                                    type="tel" name="phone" placeholder="Phone Number" 
                                    value={billingInfo.phone} onChange={handleInputChange} 
                                    required 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                                />
                                <input 
                                    type="text" name="city" placeholder="City/District" 
                                    value={billingInfo.city} onChange={handleInputChange} 
                                    required 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                                />
                                <input 
                                    type="text" name="zip" placeholder="Zip Code" 
                                    value={billingInfo.zip} onChange={handleInputChange} 
                                    required 
                                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                                />
                                <textarea 
                                    name="address" placeholder="Detailed Address (Street, House)" 
                                    value={billingInfo.address} onChange={handleInputChange} 
                                    rows="1" 
                                    required 
                                    className="md:col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                            </div>
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white p-6 shadow-xl rounded-xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <CreditCard className="w-6 h-6 mr-3 text-indigo-500" />
                                Select Payment Method
                            </h2>
                            <div className="space-y-4">
                                <label className={`flex items-center p-4 rounded-lg cursor-pointer transition duration-200 ${paymentMethod === 'online' ? 'bg-indigo-50 border-indigo-500 border-2' : 'border border-gray-300'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment_method" 
                                        value="online" 
                                        checked={paymentMethod === 'online'} 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="ml-3">
                                        <span className="text-lg font-medium text-gray-900">Online Payment</span>
                                        <p className="text-sm text-gray-500">Credit/Debit Card, Mobile Banking (Bkash, Nagad, Rocket)</p>
                                    </div>
                                </label>
                                <label className={`flex items-center p-4 rounded-lg cursor-pointer transition duration-200 ${paymentMethod === 'cod' ? 'bg-indigo-50 border-indigo-500 border-2' : 'border border-gray-300'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment_method" 
                                        value="cod" 
                                        checked={paymentMethod === 'cod'} 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div className="ml-3">
                                        <span className="text-lg font-medium text-gray-900">Cash on Delivery (COD)</span>
                                        <p className="text-sm text-gray-500">Pay cash after service completion</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1 mt-8 lg:mt-0">
                        <div className="sticky top-20 bg-white p-6 shadow-xl rounded-xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
                                Your Order Summary
                            </h2>
                            
                            {/* Item List */}
                            <div className="space-y-4 mb-5 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-gray-600 border-b pb-2">
                                        <span className="text-sm font-medium">{item.name} <span className="text-xs text-gray-400">({item.qty} pcs)</span></span>
                                        <span className="text-sm font-semibold text-gray-800">{formatCurrency(item.price * item.qty)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Calculation */}
                            <div className="space-y-3 pt-3 border-t">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">VAT/Tax ({taxRate * 100}%):</span>
                                    <span className="font-medium text-gray-800">{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Service Fee:</span>
                                    <span className="font-medium text-gray-800">{formatCurrency(processingFee)}</span>
                                </div>
                            </div>

                            {/* Grand Total */}
                            <div className="flex justify-between text-2xl font-bold border-t pt-4 mt-4">
                                <span>Total Payable:</span>
                                <span className="text-indigo-600">{formatCurrency(total)}</span>
                            </div>

                            {/* Order Button */}
                            <button 
                                type="submit" 
                                className="w-full bg-indigo-600 text-white py-4 mt-6 rounded-lg text-lg font-bold hover:bg-indigo-700 transition duration-300 shadow-lg shadow-indigo-200"
                            >
                                Confirm Order
                            </button>
                            
                            <p className="text-center text-sm text-gray-500 mt-4">
                                By ordering, you agree to our <Link to="/terms" className="text-indigo-600 hover:underline">Terms and Conditions</Link>.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;