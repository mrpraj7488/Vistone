# 🚀 Vistone - Digital Marketplace SaaS Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue.svg)](https://tailwindcss.com/)

A modern, full-stack digital marketplace platform built with React, Supabase, and Tailwind CSS. Features comprehensive admin panel, user management, role-based permissions, and more.

## ✨ Features

### 🎯 Core Features
- **Digital Product Marketplace** - Sell and manage digital products
- **User Management** - Complete user lifecycle management
- **Role-Based Access Control** - Admin, Co-Admin, and User roles
- **Real-time Analytics** - Dashboard with insights and metrics
- **Payment Integration** - Secure payment processing
- **License Management** - Digital license generation and validation

### 🛡️ Admin Features
- **Advanced Admin Panel** - Comprehensive management interface
- **User Role Management** - Granular permission control
- **Product Management** - Full CRUD operations for products
- **Order Processing** - Complete order lifecycle management
- **Analytics Dashboard** - Real-time business metrics
- **System Settings** - Configurable platform settings

### 🎨 UI/UX Features
- **Modern Design** - Clean, responsive interface
- **Dark/Light Mode** - Automatic theme switching
- **Mobile Responsive** - Optimized for all devices
- **Professional Components** - Toggle switches, modals, forms
- **SEO Optimized** - Search engine friendly structure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrpraj7488/Vistone.git
   cd Vistone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_SUPABASE_SERVICE_KEY=your-service-role-key
   ```

4. **Database Setup**
   Run the migration files in order:
   ```sql
   -- In Supabase SQL Editor
   -- 1. database/migrations/001_initial_setup.sql
   -- 2. database/migrations/002_role_permissions.sql
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
/Vistone/
├── /docs/                          # Documentation
│   ├── README.md                   # This file
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── DATABASE_SETUP.md          # Database setup
│   └── ERROR_HANDLING_GUIDE.md    # Error handling
├── /database/
│   ├── /migrations/               # SQL migration files
│   └── /seeds/                    # Sample data
├── /src/
│   ├── /components/
│   │   ├── /admin/                # Admin components
│   │   ├── /common/               # Reusable components
│   │   └── /ui/                   # UI components
│   ├── /pages/
│   │   ├── /admin/                # Admin pages
│   │   ├── /auth/                 # Authentication
│   │   └── /public/               # Public pages
│   ├── /utils/                    # Utility functions
│   ├── /services/                 # API services
│   └── /lib/                      # Libraries & config
└── /api/                          # Backend API (optional)
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing
- **React Hot Toast** - Elegant notifications

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust database
- **Row Level Security** - Database-level security
- **Real-time subscriptions** - Live data updates

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **Netlify** - Deployment platform

## 🔐 User Roles & Permissions

### Admin (Full Access)
- Complete system access
- User management
- System settings
- All CRUD operations

### Co-Admin (Limited Access)
- Product management
- Order processing
- Content management
- Limited user access

### User (Minimal Access)
- Personal profile management
- Order history
- Basic platform features

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 📚 Documentation

- [Database Setup Guide](docs/DATABASE_SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Error Handling Guide](docs/ERROR_HANDLING_GUIDE.md)
- [Admin Configuration](docs/ADMIN_DATABASE_CONFIG.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend platform
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [React](https://reactjs.org/) for the powerful frontend library

## 📞 Support

For support, email support@vistone.com or join our Discord community.

---

<div align="center">
  <p>Made with ❤️ by the Vistone Team</p>
  <p>
    <a href="https://vistone.netlify.app">Live Demo</a> •
    <a href="https://github.com/mrpraj7488/Vistone/issues">Report Bug</a> •
    <a href="https://github.com/mrpraj7488/Vistone/issues">Request Feature</a>
  </p>
</div>
