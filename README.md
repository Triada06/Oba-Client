# Oba - Azerbaijani Marketplace

A modern e-commerce platform for Azerbaijan with AI-powered recommendations and an interactive drawing game.

## Features

### 🛍️ E-commerce Platform
- **Product Catalog**: Browse thousands of products across multiple categories
- **Advanced Search & Filtering**: Find products by category, price range, ratings, and more
- **Shopping Cart**: Add, remove, and manage items in your cart
- **Secure Checkout**: Complete purchases with multiple payment options
- **User Reviews**: Rate and review products

### 🤖 AI-Powered Features
- **Personalized Feed**: AI learns from your browsing and purchase history to recommend products
- **Smart Search**: Enhanced search with AI understanding of product descriptions
- **Behavioral Analytics**: Track user preferences to improve recommendations

### 🎮 Interactive Drawing Game
- **Daily Challenges**: Draw a random product each day to earn bonuses
- **AI Drawing Detection**: Advanced AI analyzes your drawings for accuracy
- **Bonus System**: Earn bonuses that can be converted to discounts
- **Leaderboards**: Compete with other users

### 🎨 Modern Design
- **Oba Branding**: Green and yellow color scheme representing growth and optimism
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion animations for better user experience
- **Accessibility**: WCAG compliant design

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **Framer Motion** - Animation library
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key
- Cloudinary account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oba-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `backend/.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/oba-marketplace
   JWT_SECRET=your-super-secret-jwt-key-here
   OPENAI_API_KEY=your-openai-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

   Create `frontend/.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both frontend (http://localhost:3000) and backend (http://localhost:5000) servers.

### Database Setup

The application will automatically create the necessary collections when you first run it. Make sure MongoDB is running on your system.

## Project Structure

```
oba-marketplace/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── vite.config.js
├── package.json             # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/ai-recommendations` - Get AI recommendations
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### Game
- `GET /api/game/state` - Get user game state
- `GET /api/game/daily-challenge` - Get daily challenge
- `POST /api/game/submit-drawing` - Submit drawing
- `POST /api/game/convert-bonuses` - Convert bonuses to discount
- `GET /api/game/bonus-history` - Get bonus transaction history

## AI Features

### Personalized Recommendations
The AI system analyzes user behavior including:
- Search history
- Viewed products
- Purchase history
- Time spent on products
- Category preferences

### Drawing Game AI
The drawing game uses OpenAI's Vision API to:
- Analyze user drawings
- Compare with target products
- Calculate accuracy scores
- Provide feedback
- Award bonuses based on performance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email info@oba.az or create an issue in the repository.

## Acknowledgments

- OpenAI for AI capabilities
- MongoDB for database
- React team for the amazing framework
- All contributors who helped build this platform
