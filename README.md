# 🏥 Hopely - Bridging Hope With Healing

<div align="center">

![Hopely Logo](frontend/public/HopelyLogo.png)

_Connecting compassionate hearts with hospitals in need_

[![Next.js](https://img.shields.io/badge/Next.js-15.5.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Ballerina](https://img.shields.io/badge/Ballerina-2201.10.0-blue?style=for-the-badge&logo=ballerina)](https://ballerina.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![PayHere](https://img.shields.io/badge/PayHere-Integration-orange?style=for-the-badge)](https://www.payhere.lk/)

</div>

## 🌟 About Hopely

Hopely is a comprehensive healthcare donation platform that bridges the gap between hospitals in need and generous donors across Sri Lanka. Our mission is to ensure that no patient suffers due to lack of essential medicines and medical supplies.

### 🎯 Vision

To create a transparent, efficient, and compassionate ecosystem where every donation directly saves lives and transforms communities.

### 🚀 Key Features

- **🏥 Hospital Dashboard**: Complete management portal for posting medicine shortages and tracking donations
- **💰 Real-time Progress Tracking**: Visual progress bars showing funding goals vs. current donations
- **🔒 Secure Payment Integration**: PayHere integration for safe and reliable transactions
- **📊 Impact Analytics**: Live statistics showing lives saved, funds raised, and hospitals helped
- **🎨 Modern UI/UX**: Beautiful, responsive design with dark green theme and golden accents
- **📱 Mobile-First Design**: Optimized for all devices and screen sizes
- **🔐 Authentication System**: Secure login/signup for donors and hospitals
- **🌍 Community Impact**: Transparent tracking of donations and their real-world impact

## 🏗️ Architecture

### Frontend (Next.js 15.5.0)

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS with custom design system
- **Language**: TypeScript
- **UI Components**: Custom glass morphism components
- **State Management**: React hooks and context

### Backend (Ballerina)

- **Language**: Ballerina 2201.10.0
- **Database**: MongoDB with native Ballerina drivers
- **Authentication**: JWT-based auth system
- **API Architecture**: RESTful services
- **Payment Processing**: PayHere integration

## 📁 Project Structure

```
Hopely/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   │   ├── donation/    # Donation listing and individual pages
│   │   │   ├── hospital/    # Hospital dashboard and management
│   │   │   ├── login/       # Authentication pages
│   │   │   └── api/         # API route handlers
│   │   ├── components/      # Reusable React components
│   │   ├── lib/            # Utility functions and configurations
│   │   └── models/         # TypeScript type definitions
│   └── public/             # Static assets
└── backend/                # Ballerina backend services
    └── HopelyBackend/
        ├── modules/        # Modular service architecture
        │   ├── auth/       # Authentication services
        │   ├── database/   # Database utilities
        │   ├── donations/  # Donation management
        │   ├── medicine/   # Medicine shortage tracking
        │   └── rbac/       # Role-based access control
        └── *.bal          # Main service files
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- Ballerina 2201.10.0
- MongoDB 7.0 or higher
- PayHere merchant account (for payment processing)

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your environment variables
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your_merchant_id
MONGODB_URI=your_mongodb_connection_string

# Start development server
npm run dev
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend/HopelyBackend

# Install Ballerina dependencies
bal build

# Create configuration file
cp config.example.toml config.toml

# Update configuration with your values
# - MongoDB connection details
# - PayHere API credentials
# - JWT secret keys

# Run the application
bal run
```

## 🔧 Configuration

### Environment Variables (Frontend)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=your_payhere_merchant_id
NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET=your_payhere_secret
MONGODB_URI=mongodb://localhost:27017/hopely
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### Configuration (Backend)

```toml
[database]
host = "localhost"
port = 27017
name = "hopely"

[payhere]
merchant_id = "your_merchant_id"
merchant_secret = "your_merchant_secret"
notify_url = "http://localhost:8080/api/payments/notify"

[jwt]
secret = "your_jwt_secret"
expiry = 86400
```

## 🌟 Core Functionality

### For Hospitals

1. **Registration & Verification**: Secure hospital registration with verification process
2. **Medicine Shortage Posting**: Create detailed requests with funding goals and urgency levels
3. **Dashboard Management**: Track donations, manage requests, and view impact metrics
4. **Real-time Updates**: Instant notifications when donations are received

### For Donors

1. **Browse Needs**: View all hospital requests with progress tracking
2. **Secure Donations**: Safe payment processing through PayHere
3. **Impact Tracking**: See exactly how donations are making a difference
4. **Community Engagement**: Join a community of compassionate donors

## 🎨 Design System

### Color Palette

- **Primary Green**: `#143f3f` - Deep, trustworthy medical green
- **Golden Accent**: `#fbbf24` - Warm, hopeful gradient accents
- **Glass Effects**: Backdrop blur with subtle transparency
- **Typography**: Modern, readable fonts with proper contrast

### UI Principles

- **Glass Morphism**: Subtle transparency and blur effects
- **Progressive Enhancement**: Works beautifully on all devices
- **Accessibility First**: WCAG compliant design patterns
- **Performance Optimized**: Fast loading with optimized assets

## 📊 Impact Metrics

Our platform tracks several key metrics:

- **Lives Saved**: Direct impact on patient care
- **Hospitals Supported**: Network reach and growth
- **Funds Raised**: Total community contributions
- **Donor Community**: Growing network of supporters

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Payment Security**: PCI-compliant PayHere integration
- **Data Encryption**: End-to-end encryption for sensitive data
- **RBAC**: Role-based access control for different user types
- **Input Validation**: Comprehensive validation on all inputs

## 🧪 Testing

### Frontend Testing

```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run lint          # Code linting
npm run type-check    # TypeScript validation
```

### Backend Testing

```bash
bal test              # Run Ballerina tests
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build         # Build for production
npm run export        # Export static files (if needed)
```

### Backend (Cloud/Server)

```bash
bal build --production
bal run target/bin/HopelyBackend.jar
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write comprehensive tests for new features
- Update documentation for any API changes
- Ensure responsive design for all UI changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Website**: [hopely.lk](https://hopely.lk)
- **Email**: support@hopely.lk
- **Emergency**: For urgent medical needs, contact hospitals directly

## 🙏 Acknowledgments

- **Healthcare Workers**: The heroes who workd tirelessly
- **Donor Community**: Generous hearts making a difference, including the all Sri Lankans who directly or indirectly contribute to the taxpayer community
- **Technology Partners**: PayHere, MongoDB, and open-source community
- **Development Team**: Passionate developers building for good

---

<div align="center">

**Made with ❤️ for the people of Sri Lanka**

_Every donation creates a ripple effect of hope, healing, and happiness_

</div>
