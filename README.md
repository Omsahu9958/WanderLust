# 🏨 WanderLust - Hotels & Property Listing Platform

A modern, full-stack web application for discovering and booking hotels and properties worldwide. Built with Node.js, Express, and MongoDB, featuring user authentication, property management, and interactive maps.

## 🌟 Features

### 🏠 Property Management
- **Browse Properties**: View all available listings with detailed information
- **Property Details**: Comprehensive property pages with images, pricing, location, and reviews
- **Create Listings**: Add new properties with image uploads and location data
- **Edit & Delete**: Full CRUD operations for property owners
- **Image Management**: Cloud-based image storage with Cloudinary

### 👥 User System
- **Authentication**: Secure user registration and login with Passport.js
- **User Profiles**: Personalized user accounts
- **Ownership Control**: Only property owners can edit/delete their listings
- **Session Management**: Persistent sessions with MongoDB store

### 🗺️ Location & Maps
- **Interactive Maps**: Mapbox integration for property locations
- **Geocoding**: Automatic coordinate conversion from location names
- **Location Search**: Find properties by location

### ⭐ Review System
- **User Reviews**: Rate and review properties
- **Review Management**: Edit/delete own reviews
- **Rating Display**: Star ratings with visual feedback

### 🎨 User Interface
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Modern UI**: Clean, intuitive interface with Font Awesome icons
- **Flash Messages**: User-friendly notifications
- **Custom Styling**: Tailored CSS with Plus Jakarta Sans font

## 🛠️ Technology Stack

### Backend Technologies
- **Node.js** (v24.13.0) - JavaScript runtime environment
- **Express.js** (v4.18.2) - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** (v7.6.0) - MongoDB object modeling

### Frontend Technologies
- **EJS** (v3.0.2) - Templating engine for server-side rendering
- **EJS Mate** (v4.0.0) - Layout and partial template system
- **Bootstrap 5** - CSS framework for responsive design
- **Font Awesome 7** - Icon library
- **Mapbox GL JS** - Interactive mapping solution

### Authentication & Security
- **Passport.js** (v0.7.0) - Authentication middleware
- **Passport-Local** (v1.0.0) - Local username/password strategy
- **Passport-Local-Mongoose** (v9.0.1) - Mongoose plugin for Passport
- **Express-Session** (v1.19.0) - Session management
- **Connect-Mongo** (v6.0.0) - MongoDB session store
- **Connect-Flash** (v0.1.1) - Flash message system

### File Management & Storage
- **Multer** (v1.4.5-lts.1) - File upload middleware
- **Cloudinary** (v1.41.3) - Cloud-based image storage
- **Multer-Storage-Cloudinary** (v4.0.0) - Cloudinary storage engine

### Data Validation & Utilities
- **Joi** (v18.0.2) - Data validation library
- **Method-Override** (v3.0.0) - HTTP method override support
- **Dotenv** (v17.3.1) - Environment variable management
- **Mapbox SDK** (v0.16.2) - Geocoding services

## 📁 Project Structure

```
WanderLust/
├── 📁 controllers/           # Business logic controllers
│   ├── listing.js           # Property management logic
│   ├── review.js            # Review system logic
│   └── user.js              # User authentication logic
├── 📁 models/               # Database models
│   ├── listing.js           # Property schema with geospatial data
│   ├── review.js            # Review schema
│   └── user.js              # User schema with Passport integration
├── 📁 routes/               # API routes
│   ├── listing.js           # Property CRUD routes
│   ├── review.js            # Review management routes
│   └── user.js              # Authentication routes
├── 📁 utils/                # Utility functions
│   ├── ExpressError.js      # Custom error handling
│   └── wrapAsync.js         # Async error wrapper
├── 📁 views/                # EJS templates
│   ├── 📁 includes/         # Template partials
│   │   ├── flash.ejs        # Flash messages
│   │   ├── footer.ejs       # Footer component
│   │   └── navbar.ejs       # Navigation bar
│   ├── 📁 layouts/          # Layout templates
│   │   └── boilerplate.ejs  # Main layout
│   ├── 📁 listings/         # Property-related views
│   │   ├── index.ejs        # Property listing page
│   │   ├── show.ejs         # Property details page
│   │   ├── new.ejs          # Create property form
│   │   └── edit.ejs         # Edit property form
│   ├── 📁 user/             # User-related views
│   │   ├── login.ejs        # Login form
│   │   └── signup.ejs       # Registration form
│   └── error.ejs            # Error page
├── 📁 public/               # Static assets
│   ├── 📁 css/              # Stylesheets
│   │   └── style.css        # Custom styles
│   └── 📁 js/               # Client-side JavaScript
│       └── script.js        # Frontend functionality
├── 📁 init/                 # Database initialization
│   ├── data.js              # Seed data
│   └── index.js             # Initialization script
├── app.js                   # Main application entry point
├── schema.js                # Joi validation schemas
├── middleware.js            # Custom middleware functions
├── cloudeConfig.js          # Cloudinary configuration
├── package.json             # Project dependencies
└── README.md                # This documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v24.13.0 or higher)
- MongoDB database
- Cloudinary account (for image storage)
- Mapbox access token (for maps)

### Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development
DB_URL=mongodb://localhost:27017/wanderlust
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUDE_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_access_token
PORT=8080
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WanderLust
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the environment variables template above
   - Replace with your actual API keys and database URL

4. **Initialize the database**
   ```bash
   node init/index.js
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:8080`

## 🏛️ Database Schema

### Property Model
```javascript
{
  title: String (required),
  description: String,
  image: {
    filename: String,
    url: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [ObjectId] (ref: Review),
  owner: ObjectId (ref: User),
  geometry: {
    type: "Point",
    coordinates: [Number, Number]
  }
}
```

### User Model
```javascript
{
  email: String (required),
  username: String (from Passport-Local-Mongoose),
  password: String (hashed by Passport)
}
```

### Review Model
```javascript
{
  rating: Number (1-5),
  comment: String,
  author: ObjectId (ref: User)
}
```

## 🔐 Security Features

- **Password Hashing**: Automatic password hashing with Passport-Local-Mongoose
- **Session Security**: Secure HTTP-only cookies with expiration
- **CSRF Protection**: Built-in Express security measures
- **Input Validation**: Joi schema validation for all user inputs
- **Authorization**: Role-based access control (owner-only operations)
- **Secure File Upload**: Cloudinary handles image security

## 🎯 API Endpoints

### Property Routes
- `GET /listing` - Display all properties
- `POST /listing` - Create new property (authenticated)
- `GET /listing/new` - New property form (authenticated)
- `GET /listing/:id` - Show property details
- `GET /listing/:id/edit` - Edit property form (owner only)
- `PUT /listing/:id` - Update property (owner only)
- `DELETE /listing/:id` - Delete property (owner only)

### Review Routes
- `POST /listing/:id/reviews` - Add review (authenticated)
- `DELETE /listing/:id/reviews/:reviewid` - Delete review (author only)

### User Routes
- `GET /signup` - Registration form
- `POST /signup` - Create new user
- `GET /login` - Login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## 🌍 External Services

### Mapbox Integration
- **Geocoding**: Convert location names to coordinates
- **Interactive Maps**: Display property locations
- **Map Tokens**: Secure API access

### Cloudinary Integration
- **Image Storage**: Cloud-based image hosting
- **Automatic Optimization**: Image compression and formatting
- **Secure Upload**: Direct cloud storage

## 🧪 Development Features

### Error Handling
- Custom ExpressError class
- Centralized error middleware
- User-friendly error pages
- Async error wrapping

### Middleware Stack
- Authentication checks
- Input validation
- File upload handling
- Flash message management
- Session persistence

### Development Tools
- Environment-based configuration
- Hot reloading support
- Comprehensive logging
- Database seeding

## 📱 Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Bootstrap Grid**: Flexible layout system
- **Touch-Friendly**: Mobile-optimized interactions
- **Performance**: Optimized images and assets

## 🔄 Future Enhancements

- **Advanced Search**: Filter by price, location, amenities
- **Booking System**: Reservation management
- **Payment Integration**: Stripe/PayPal support
- **Property Categories**: Hotels, apartments, villas
- **User Dashboard**: Personal booking management
- **Review Photos**: Image uploads in reviews
- **Notifications**: Email alerts for bookings
- **Social Features**: Property sharing, favorites

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Om** - Full-stack developer passionate about creating beautiful, functional web applications.

---

*Built with ❤️ using modern web technologies*