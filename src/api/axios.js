// src/api/axios.js

import axios from 'axios';

const API = axios.create({
  // 🚨 আপনার ব্যাকএন্ড URL অবশ্যই সঠিক পোর্ট এবং পাথ সহ দিন
  baseURL: 'http://localhost:5000/api', 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // JWT টোকেন Authorization হেডার এ যোগ করা (Bearer স্পেস সহ)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;