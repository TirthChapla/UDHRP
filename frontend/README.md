# UDHRP - Unified Digital Health Record Platform

A comprehensive, production-ready frontend application for India's unified digital health record system.

## 🚀 Features

### Core Modules

- **Landing Page** - Modern, polished hero section with features showcase
- **Authentication System** - Multi-step registration with role-based access
- **Patient Dashboard** - Health metrics, appointments, AI insights, and medical records
- **Doctor Dashboard** - Appointment management, prescriptions, and patient checkups
- **Laboratory Dashboard** - Sample tracking, report uploads, and patient notifications
- **Insurance Dashboard** - AI-powered health assessments and policy management

### Design System

- Professional SaaS-style UI with intentional spacing and typography
- Comprehensive CSS variable system for colors, spacing, shadows
- Smooth animations and hover states
- Fully responsive design (mobile, tablet, desktop)
- Grid-based layouts with proper visual hierarchy

### Technical Features

- React 18 with functional components
- React Router v6 for navigation
- Lucide React icons
- Pure CSS (no Tailwind or utility frameworks)
- Role-based routing and authentication
- Protected routes with access control

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 🎨 Design Philosophy

- **No generic layouts** - Every page is thoughtfully designed
- **Strong visual hierarchy** - Intentional typography scale and spacing rhythm
- **Grid-based layouts** - Deliberate alignment throughout
- **Subtle depth** - Shadows, gradients, and large rounded corners (16-24px)
- **Tasteful interactions** - Smooth transitions and hover states
- **Modern SaaS aesthetic** - Production-ready, polished appearance

## 🧩 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar/         # Navigation with role-based menu
│   ├── Card/           # Card component with variants
│   ├── Button/         # Button with multiple variants
│   ├── Input/          # Form input with validation
│   └── Select/         # Select dropdown component
├── pages/              # Page components
│   ├── LandingPage/    # Public homepage
│   ├── Login/          # Authentication
│   ├── Register/       # Multi-step registration
│   ├── PatientDashboard/
│   ├── DoctorDashboard/
│   ├── LaboratoryDashboard/
│   └── InsuranceDashboard/
├── styles/
│   └── globals.css     # Design system & global styles
├── App.jsx             # Main app with routing
└── main.jsx            # Entry point
```

## 🎯 User Roles

### Patient
- View health score and metrics
- Book appointments with doctors
- Access medical records and prescriptions
- Get AI-powered health insights
- Receive vaccination and checkup reminders

### Doctor
- Manage appointment requests
- View today's schedule
- Create digital prescriptions
- Access patient health records via Health ID
- Track performance metrics

### Laboratory
- Track pending samples
- Upload test reports to patient profiles
- Automated patient notifications
- Search patients by Health ID
- Manage diagnostic services

### Insurance Company
- Review policy applications
- AI-powered health scoring
- Risk assessment dashboard
- View applicant health profiles (read-only)
- Approve/decline policies

## 🔐 Authentication Flow

1. **Registration** - Multi-step form with role-specific fields
2. **Login** - Email/password authentication
3. **Protected Routes** - Role-based access control
4. **User Menu** - Quick access to dashboard and profile

## 🎨 CSS Architecture

- **CSS Variables** - Comprehensive design tokens
- **Component-based** - Scoped styles per component
- **Semantic naming** - Clear, readable class names
- **Mobile-first** - Responsive breakpoints
- **No utility classes** - Semantic component styles only

## 🔮 Future Backend Integration

The frontend is designed to integrate seamlessly with a Java Spring Boot backend:

- RESTful API endpoints ready
- Form validation prepared for API integration
- Mock data structure matches expected API responses
- JWT authentication structure in place
- File upload endpoints ready

## 🌟 Key Pages

### Landing Page
- Hero section with animated elements
- Feature showcase grid
- User type cards (Patient, Doctor, Lab, Insurance)
- How it works section
- Call-to-action section

### Patient Dashboard
- Health score with trend
- Upcoming appointments calendar
- AI health insights
- Health metrics (BP, Heart Rate, BMI, Blood Sugar)
- Recent medical records
- Smart reminders

### Doctor Dashboard
- Appointment requests management
- Today's schedule timeline
- Performance metrics
- Recent prescriptions
- Quick actions panel

### Laboratory Dashboard
- Pending samples queue
- Upload report functionality
- Recent uploads tracking
- Priority case indicators
- Patient search

### Insurance Dashboard
- Pending assessments list
- AI health score visualization
- Risk level classification
- Health score distribution analytics
- Recent approvals tracking

## 📱 Responsive Design

- **Desktop**: Full-featured layout (1280px+)
- **Tablet**: Optimized grid columns (768px - 1279px)
- **Mobile**: Single-column stacked layout (< 768px)

## 🎭 Component Variants

### Button
- Primary, Secondary, Outline, Ghost, Success, Danger
- Small, Medium, Large sizes
- Loading states
- Icon support

### Card
- Default, Elevated, Outline, Gradient
- Hover effects
- Flexible content slots

### Input
- Text, Email, Password, Date, Tel
- Icon support
- Error states
- Helper text

## 🚦 Getting Started

After installation, the app will be available at:
- Development: `http://localhost:3000`
- Login with any email/password (mock authentication)
- Register with different roles to see role-specific dashboards

## 📄 License

This project is built for the UDHRP - Unified Digital Health Record Platform initiative.

---

Built with ❤️ using React + Vite
