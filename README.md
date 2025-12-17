# 🎨 StyleDecor - Stylish Decoration Services Platform

## 📋 Project Overview

**StyleDecor** is a modern, full-featured decoration services platform that connects customers with professional decorators for various events and occasions. Built with React and modern web technologies, it provides a seamless experience for booking decoration services, managing bookings, and handling payments.

## 🌐 Live URL

**Frontend:** [https://stylish-decoration.netlify.app](https://stylish-decoration.netlify.app)  
**Backend API:** [https://stylish-decoration-api.herokuapp.com](https://stylish-decoration-api.herokuapp.com)

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Email/Password Registration & Login**
- **Google OAuth Social Login** (Firebase)
- **JWT Token-based Authentication**
- **Role-based Access Control** (Admin, Decorator, User)
- **Profile Image Upload** (ImageBB integration)

### 👥 User Management
- **Multi-role System** (Admin, Decorator, User)
- **Admin Dashboard** for user management
- **Decorator Application System**
- **Profile Management**

### 🎨 Service Management
- **Service Catalog** with detailed descriptions
- **Advanced Search & Filtering**
- **Price Range Filtering**
- **Service Categories**
- **Image Gallery**

### 📅 Booking System
- **Real-time Booking Management**
- **Date & Time Selection**
- **Service Customization**
- **Booking Status Tracking**
- **Cancellation Protection**

### 💳 Payment Integration
- **Stripe Payment Gateway**
- **Secure Payment Processing**
- **Payment History**
- **Invoice Generation**
- **Refund Management**

### 📊 Analytics & Reporting
- **Revenue Monitoring**
- **Business Analytics**
- **Booking Statistics**
- **Performance Charts**
- **Data Visualization**

### 📱 Modern UI/UX
- **Responsive Design**
- **DaisyUI Components**
- **Framer Motion Animations**
- **Clean & Modern Interface**
- **Consistent Design System**

### 🔧 Additional Features
- **SMS Notifications**
- **Email Notifications**
- **Coupon System**
- **Service Add-ons**
- **AI Recommendations**
- **Service Coverage Map**

## 🛠️ NPM Packages Used

### Core Dependencies
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.10.1",
  "vite": "^7.2.4"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^4.1.17",
  "daisyui": "^5.5.8",
  "react-icons": "^5.5.0",
  "framer-motion": "^12.23.25",
  "motion": "^12.23.26"
}
```

### Authentication & Security
```json
{
  "firebase": "^12.6.0",
  "jwt-decode": "^4.0.0",
  "axios": "^1.13.2"
}
```

### Payment Processing
```json
{
  "@stripe/react-stripe-js": "^5.4.1",
  "@stripe/stripe-js": "^8.5.3"
}
```

### Data Visualization
```json
{
  "chart.js": "^4.5.1",
  "react-chartjs-2": "^5.3.1"
}
```

### Maps & Location
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0"
}
```

### Notifications & Alerts
```json
{
  "react-toastify": "^11.0.5",
  "react-hot-toast": "^2.6.0",
  "sweetalert2": "^11.26.4"
}
```

### Utilities
```json
{
  "moment": "^2.30.1",
  "lucide-react": "^0.559.0",
  "cors": "^2.8.5",
  "express": "^4.22.1",
  "concurrently": "^8.2.2"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^5.1.1",
  "@tailwindcss/vite": "^4.1.17",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Stripe account
- MongoDB database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/stylish-decoration.git
cd stylish-decoration
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure Environment Variables**
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# ImageBB Configuration
VITE_IMAGEBB_API_KEY=your_imagebb_api_key

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

5. **Start Development Server**
```bash
npm run dev
```

6. **Start with Mock Server**
```bash
npm run dev:full
```

## 📁 Project Structure

```
src/
├── api/                 # API configuration
├── assets/             # Static assets
├── components/         # Reusable components
├── firebase/           # Firebase configuration
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── Dashboard/      # Dashboard pages
│   └── ...            # Other pages
├── routes/             # Route configurations
├── styles/             # CSS styles
└── utils/              # Utility functions
```

## 🔒 Security Features

- **Environment Variables** for sensitive data
- **JWT Token Authentication**
- **Role-based Access Control**
- **Input Validation & Sanitization**
- **Secure Payment Processing**
- **CORS Protection**

## 🎨 Design System

- **Color Palette:** Purple, Blue, Indigo gradients
- **Typography:** Clean, modern fonts
- **Spacing:** Consistent 4px grid system
- **Components:** DaisyUI-based design system
- **Animations:** Smooth Framer Motion transitions

## 📱 Responsive Design

- **Mobile-first approach**
- **Tablet optimization**
- **Desktop enhancement**
- **Cross-browser compatibility**

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- DaisyUI for beautiful components
- Firebase for authentication services
- Stripe for payment processing
- All contributors and supporters

---

**Made with ❤️ for beautiful decorations**