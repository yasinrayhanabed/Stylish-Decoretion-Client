import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaGift,
  FaPlus,
  FaMinus,
  FaMapMarkerAlt,
  FaCrown,
  FaRobot,
  FaUsers,
} from "react-icons/fa";
import {
  getRecommendedAddons,
  calculateAddonTotal,
} from "../utils/serviceAddons";
import { applyCoupon } from "../utils/couponUtils";
import { subscriptionPlans } from "../utils/subscriptionUtils";
import {
  getDecoratorRecommendations,
  getMultipleDecoratorsForEvent,
} from "../utils/aiRecommendation";
import { sendSMS, smsTemplates } from "../utils/smsUtils";

export default function EnhancedBookingForm({ service, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    time: "",
    guests: 50,
    budget: "medium",
    serviceType: service?.category || "home",
    location: "dhaka-central",
    subscription: null,
  });

  const [selectedAddons, setSelectedAddons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [aiRecommendations, setAiRecommendations] = useState(null);
  const [multipleDecorators, setMultipleDecorators] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(false);

  const locations = [
    { id: "dhaka-central", name: "Dhaka Central", available: true },
    { id: "chittagong", name: "Chittagong Branch", available: true },
    { id: "sylhet", name: "Sylhet Office", available: false },
  ];

  const basePrice = service?.price || 5000;
  const addonTotal = calculateAddonTotal(selectedAddons);
  const subtotal = basePrice + addonTotal;
  const finalAmount = subtotal - couponDiscount;

  useEffect(() => {
    // Get AI recommendations
    const recommendations = getDecoratorRecommendations({
      serviceType: formData.serviceType,
      budget: formData.budget,
      style: "modern",
    });
    setAiRecommendations(recommendations);

    // Check if multiple decorators needed
    setMultipleDecorators(getMultipleDecoratorsForEvent(formData.guests));
  }, [formData.serviceType, formData.budget, formData.guests]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const result = await applyCoupon(couponCode, subtotal);
      if (result.valid) {
        setCouponDiscount(result.discount);
        setAppliedCoupon(result.coupon);
        toast.success(`Coupon applied! You saved ৳${result.discount}`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to apply coupon");
    }
  };

  const toggleAddon = (addonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleSubscriptionSelect = (plan) => {
    setFormData((prev) => ({ ...prev, subscription: plan.id }));
    setShowSubscriptions(false);
    toast.success(`${plan.name} subscription selected!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      ...formData,
      addons: selectedAddons,
      coupon: appliedCoupon,
      basePrice,
      addonTotal,
      discount: couponDiscount,
      finalAmount,
      aiRecommendations: aiRecommendations?.recommendations?.[0],
      multipleDecorators,
    };

    // Send SMS notification
    try {
      await sendSMS(
        formData.phone,
        smsTemplates.bookingConfirmation(
          service?.name || "Decoration Service",
          formData.date,
          finalAmount
        )
      );
    } catch (error) {
      console.log("SMS notification failed:", error);
    }

    onSubmit(bookingData);
  };

  const recommendedAddons = getRecommendedAddons(
    formData.serviceType,
    formData.budget
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold mb-8 text-center">
        Enhanced Booking Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center">
            <FaMapMarkerAlt className="mr-2" /> Service Location
          </label>
          <select
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full p-3 border rounded-lg"
          >
            {locations.map((location) => (
              <option
                key={location.id}
                value={location.id}
                disabled={!location.available}
              >
                {location.name} {!location.available && "(Coming Soon)"}
              </option>
            ))}
          </select>
        </div>

        {/* Subscription Plans */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center">
              <FaCrown className="mr-2 text-purple-600" /> Subscription Plans
            </h3>
            <button
              type="button"
              onClick={() => setShowSubscriptions(!showSubscriptions)}
              className="text-purple-600 hover:text-purple-800"
            >
              {showSubscriptions ? "Hide" : "View Plans"}
            </button>
          </div>

          {showSubscriptions && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    formData.subscription === plan.id
                      ? "border-purple-500 bg-purple-100"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => handleSubscriptionSelect(plan)}
                >
                  <h4 className="font-bold">{plan.name}</h4>
                  <p className="text-purple-600 font-bold">
                    ৳{plan.price}/{plan.duration}
                  </p>
                  <p className="text-sm text-gray-600">
                    {plan.services} services
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        {aiRecommendations && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <FaRobot className="mr-2 text-blue-600" /> AI Recommended
              Decorator
            </h3>
            <div className="flex items-center space-x-4">
              <img
                src={aiRecommendations.recommendations[0]?.photo}
                alt={aiRecommendations.recommendations[0]?.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-bold">
                  {aiRecommendations.recommendations[0]?.name}
                </h4>
                <p className="text-sm text-gray-600">
                  ★ {aiRecommendations.recommendations[0]?.rating} •{" "}
                  {aiRecommendations.recommendations[0]?.experience} years
                </p>
                <p className="text-xs text-blue-600">
                  AI Match: {aiRecommendations.recommendations[0]?.aiScore}%
                </p>
              </div>
            </div>
            {multipleDecorators && (
              <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                <p className="text-sm flex items-center">
                  <FaUsers className="mr-2" />
                  <strong>Multiple decorators recommended</strong> for{" "}
                  {formData.guests}+ guests
                </p>
              </div>
            )}
          </div>
        )}

        {/* Service Add-ons */}
        <div>
          <h3 className="text-lg font-bold mb-4">Service Add-ons</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedAddons.map((addon) => (
              <div
                key={addon.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedAddons.includes(addon.id)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => toggleAddon(addon.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{addon.image}</span>
                      <h4 className="font-bold">{addon.name}</h4>
                      {addon.popular && (
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {addon.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Duration: {addon.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">৳{addon.price}</p>
                    <button
                      type="button"
                      className={`mt-2 p-1 rounded-full ${
                        selectedAddons.includes(addon.id)
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {selectedAddons.includes(addon.id) ? (
                        <FaMinus />
                      ) : (
                        <FaPlus />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Code */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <FaGift className="mr-2 text-yellow-600" /> Coupon Code
          </h3>
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 p-3 border rounded-lg"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Apply
            </button>
          </div>
          {appliedCoupon && (
            <div className="mt-3 p-3 bg-green-100 rounded-lg">
              <p className="text-green-800 font-medium">
                ✓ {appliedCoupon.description} - Saved ৳{couponDiscount}
              </p>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4">Price Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Service</span>
              <span>৳{basePrice}</span>
            </div>
            {addonTotal > 0 && (
              <div className="flex justify-between">
                <span>Add-ons ({selectedAddons.length})</span>
                <span>৳{addonTotal}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{subtotal}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-৳{couponDiscount}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>৳{finalAmount}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg text-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          Book Now - ৳{finalAmount}
        </button>
      </form>
    </div>
  );
}
