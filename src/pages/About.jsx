import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero min-h-[50vh] bg-gradient-to-r from-purple-600 to-blue-600"
      >
        <div className="hero-content text-center text-white">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-5">About StyleDecor</h1>
            <p className="text-xl">
              Transforming spaces with creativity and expertise since 2020
            </p>
          </div>
        </div>
      </motion.section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg mb-4">
                StyleDecor was founded with a simple mission: to make professional decoration services accessible to everyone. We believe that every space has the potential to be extraordinary.
              </p>
              <p className="text-lg mb-4">
                Our team of expert decorators specializes in transforming homes, offices, and event venues into stunning spaces that reflect your personality and style.
              </p>
              <p className="text-lg">
                With our innovative online booking system, you can easily schedule consultations, book services, and track your project progress from start to finish.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="stat bg-primary text-primary-content rounded-lg">
                <div className="stat-value">100+</div>
                <div className="stat-title text-primary-content">Projects Completed</div>
              </div>
              <div className="stat bg-secondary text-secondary-content rounded-lg">
                <div className="stat-value">20+</div>
                <div className="stat-title text-secondary-content">Expert Decorators</div>
              </div>
              <div className="stat bg-accent text-accent-content rounded-lg">
                <div className="stat-value">98%</div>
                <div className="stat-title text-accent-content">Client Satisfaction</div>
              </div>
              <div className="stat bg-info text-info-content rounded-lg">
                <div className="stat-value">24/7</div>
                <div className="stat-title text-info-content">Support Available</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Home Decoration",
                description: "Transform your living spaces with our expert home decoration services.",
                icon: "🏠"
              },
              {
                title: "Event Planning", 
                description: "Make your special events memorable with our professional decoration.",
                icon: "🎉"
              },
              {
                title: "Office Spaces",
                description: "Create inspiring work environments that boost productivity.",
                icon: "🏢"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
                className="card bg-base-100 shadow-xl"
              >
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="card-title justify-center">{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}