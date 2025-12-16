# 🎨 StyleDecor - Professional Decoration Service Platform

## 📋 Project Overview

**StyleDecor** is a comprehensive web application that connects customers with professional decorators for various decoration services. The platform provides a seamless booking experience, payment processing, and project management system.

## 🌐 Live URL
[StyleDecor Live Demo](https://your-live-url.com) *(Replace with actual deployment URL)*

## ✨ Key Features

### 🏠 **For Customers**
- Browse decoration packages and services with advanced filtering
- Select preferred date & time slots for bookings
- Secure online payment processing with Stripe integration
- Real-time booking status tracking
- Payment history and booking management
- User dashboard with personalized experience

### 👨‍🎨 **For Decorators**
- Dedicated decorator dashboard
- Today's schedule with project overview
- Step-by-step project status updates (Assigned → Planning → Materials → On the Way → Setup → Completed)
- Earnings summary and payment history
- Project management tools

### 🔧 **For Administrators**
- Comprehensive admin dashboard with analytics
- User, decorator, and service management
- Booking management with decorator assignment
- Business analytics with interactive charts
- Revenue monitoring and reporting
- Service management with CRUD operations

### 🎯 **Core Features**
- **Authentication System**: Secure login/registration with role-based access
- **Payment Integration**: Stripe payment gateway for secure transactions
- **Real-time Updates**: Live status updates and notifications
- **Responsive Design**: Mobile-first approach with DaisyUI components
- **Search & Filter**: Advanced search and filtering capabilities
- **Dashboard Analytics**: Comprehensive business insights and charts

## 📦 NPM Packages Used

### **Frontend Dependencies**
```json
{
  "@stripe/react-stripe-js": "^2.4.0",
  "@stripe/stripe-js": "^2.4.0",
  "chart.js": "^4.4.1",
  "framer-motion": "^10.16.16",
  "react": "^18.2.0",
  "react-chartjs-2": "^5.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^4.12.0",
  "react-router-dom": "^6.20.1",
  "react-toastify": "^9.1.3",
  "axios": "^1.6.2"
}
```

### **Development Dependencies**
```json
{
  "@types/react": "^18.2.37",
  "@types/react-dom": "^18.2.15",
  "@vitejs/plugin-react": "^4.1.1",
  "autoprefixer": "^10.4.16",
  "daisyui": "^4.4.19",
  "eslint": "^8.53.0",
  "eslint-plugin-react": "^7.33.2",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.4",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.3.6",
  "vite": "^4.5.0"
}
```

### **UI & Styling**
- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: Component library for Tailwind CSS
- **React Icons**: Popular icon library
- **Framer Motion**: Animation library for smooth transitions

### **State Management & API**
- **Axios**: HTTP client for API requests
- **React Router DOM**: Client-side routing
- **React Toastify**: Toast notifications

### **Payment & Charts**
- **Stripe**: Payment processing integration
- **Chart.js**: Data visualization library
- **React Chart.js 2**: React wrapper for Chart.js

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB database
- Stripe account for payments

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
Create a `.env` file in the root directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/styledecor
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/styledecor

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── api/                    # API configuration
├── components/             # Reusable components
├── pages/                  # Page components
│   ├── Dashboard/         # Dashboard pages
│   └── ...               # Other pages
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── styles/                # CSS and styling
└── firebase/              # Firebase configuration
```

## 🎨 UI/UX Design Principles

- **Modern DaisyUI-based Interface**: Clean, professional design
- **Beautiful Accent Colors**: Purple, blue, and indigo gradient themes
- **Consistent Spacing**: Uniform padding and margins throughout
- **Clear Visual Hierarchy**: Proper typography and layout structure
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion for enhanced user experience

## 🔐 Security Features

- Environment variables for sensitive data
- Secure authentication with Firebase
- Protected routes with role-based access
- Secure payment processing with Stripe
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- DaisyUI for the beautiful component library
- Stripe for secure payment processing
- Firebase for authentication services
- Chart.js for data visualization
- All contributors and testers

---

**Made with ❤️ for professional decoration services**