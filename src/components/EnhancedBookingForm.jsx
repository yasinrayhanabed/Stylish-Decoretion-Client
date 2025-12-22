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

export default function EnhancedBookingForm({
  service,
  onSubmit,
  initialValues,
}) {
  const [formData, setFormData] = useState({
    name: initialValues?.name || "",
    phone: initialValues?.phone || "",
    email: initialValues?.email || "",
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
    <div className="max-w-4xl mx-auto bg-base-200 rounded-2xl shadow-xl p-4 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-base-content">
        Booking For {service?.name || "Decoration Service"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-3 border border-base-300 rounded-lg bg-base-100 text-base-content"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full p-3 border border-base-300 rounded-lg bg-base-100 text-base-content"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full p-3 border border-base-300 rounded-lg bg-base-100 text-base-content"
            required
          />
          <div className="relative">
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full p-3 border border-base-300 rounded-lg bg-base-100 text-base-content"
              required
            />
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  date: new Date().toISOString().split("T")[0],
                }))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary hover:text-primary-focus font-semibold bg-base-100 px-2 rounded"
            >
              Today
            </button>
          </div>
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center text-base-content">
            <FaMapMarkerAlt className="mr-2" /> Service Location
          </label>
          <select
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full p-3 border border-base-300 rounded-lg bg-base-100 text-base-content"
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
        <div className="bg-base-100 p-4 md:p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center text-base-content">
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
                      ? "border-primary bg-primary/10"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                  onClick={() => handleSubscriptionSelect(plan)}
                >
                  <h4 className="font-bold text-base-content">{plan.name}</h4>
                  <p className="text-primary font-bold">
                    ৳{plan.price}/{plan.duration}
                  </p>
                  <p className="text-sm text-base-content/70">
                    {plan.services} services
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Recommendations */}
        {aiRecommendations && (
          <div className="bg-base-100 p-4 md:p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center text-base-content">
              <FaRobot className="mr-2 text-blue-600" /> AI Recommended
              Decorator
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={aiRecommendations.recommendations[0]?.photo}
                alt={aiRecommendations.recommendations[0]?.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://dummyimage.com/100x100/cccccc/000000&text=User";
                }}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-bold text-base-content">
                  {aiRecommendations.recommendations[0]?.name}
                </h4>
                <p className="text-sm text-base-content/70">
                  ★ {aiRecommendations.recommendations[0]?.rating} •{" "}
                  {aiRecommendations.recommendations[0]?.experience} years
                </p>
                <p className="text-xs text-info">
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
          <h3 className="text-lg font-bold mb-4 text-base-content">
            Service Add-ons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedAddons.map((addon) => (
              <div
                key={addon.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedAddons.includes(addon.id)
                    ? "border-success bg-success/10"
                    : "border-base-300 hover:border-success/50"
                }`}
                onClick={() => toggleAddon(addon.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{addon.image}</span>
                      <h4 className="font-bold text-base-content">
                        {addon.name}
                      </h4>
                      {addon.popular && (
                        <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-base-content/70 mb-2">
                      {addon.description}
                    </p>
                    <p className="text-xs text-base-content/50">
                      Duration: {addon.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">৳{addon.price}</p>
                    <button
                      type="button"
                      className={`mt-2 p-1 rounded-full ${
                        selectedAddons.includes(addon.id)
                          ? "bg-success text-success-content"
                          : "bg-base-300 text-base-content/70"
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
        <div className="bg-base-100 p-4 md:p-6 rounded-lg">
          <h3 className="text-lg font-bold mb-4 flex items-center text-base-content">
            <FaGift className="mr-2 text-yellow-600" /> Coupon Code
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full sm:flex-1 p-3 border border-base-300 rounded-lg bg-base-100 text-base-content"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="w-full sm:w-auto px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold"
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
        <div className="bg-base-100 p-4 md:p-6 rounded-lg text-base-content">
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
