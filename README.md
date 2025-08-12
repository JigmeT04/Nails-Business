# YVD Nails - Professional Nail Salon Booking System

A full-stack web application for YVD Nails salon, allowing customers to book appointments online and providing admin tools for managing bookings and availability.

## 🚀 Features

### Customer Features
- **User Authentication** - Secure login/signup with Firebase Auth
- **Service Booking** - Book appointments for various nail services
- **Real-time Availability** - View available time slots for selected dates
- **Profile Management** - Manage personal information and view appointment history
- **Responsive Design** - Optimized for desktop and mobile devices

### Admin Features
- **Appointment Management** - View, confirm, or cancel customer appointments
- **Availability Management** - Set available time slots for specific dates
- **Real-time Updates** - Instant notifications for new bookings
- **Secure Access** - Admin-only protected routes

### Services Offered
- Classic Manicure
- Gel-X Extensions
- Spa Pedicure
- Eyelash Extensions

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend**: Firebase Firestore (NoSQL Database)
- **Authentication**: Firebase Auth
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives
- **Notifications**: Sonner (toast notifications)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account and project

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Nails-Business
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   NEXT_PUBLIC_ADMIN_UID=your_admin_user_id
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Enable Authentication (Email/Password)
   - Get your Firebase config and add to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## 📁 Project Structure

```
├── app/
│   ├── admin/                 # Admin dashboard and management
│   ├── booking/              # Appointment booking page
│   ├── components/           # Reusable React components
│   ├── login/               # User authentication
│   ├── profile/             # User profile management
│   └── globals.css          # Global styles
├── components/ui/           # Shadcn/ui components
├── lib/                     # Utility functions and Firebase config
├── public/                  # Static assets
└── README.md
```

## 🔐 Security Features

- **Environment Variables** - Sensitive data stored securely
- **Admin Protection** - Admin routes protected by user ID verification
- **Input Validation** - All forms validated with Zod schemas
- **Firebase Rules** - Database security rules (configure in Firebase Console)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm run start
```

## 📊 Database Schema

### Collections

**users**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string",
  "instagram": "string",
  "dateOfBirth": "string"
}
```

**appointments**
```json
{
  "userId": "string",
  "name": "string",
  "email": "string",
  "service": "string",
  "date": "string",
  "time": "string",
  "status": "pending|confirmed|cancelled",
  "additionalNotes": "string",
  "createdAt": "timestamp"
}
```

**availability**
```json
{
  "slots": ["09:00 AM", "10:00 AM", "11:00 AM", ...]
}
```

## 🎨 Customization

### Brand Colors
The primary brand color `#FAD1E8` (soft pink) is used throughout the application. To change:

1. Update inline styles in components
2. Or extend Tailwind config with custom colors

### Services
Edit the services array in `/app/booking/page.tsx` to modify available services.

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Verify environment variables are correct
   - Check Firebase project settings
   - Ensure Firestore and Auth are enabled

2. **Admin Access Denied**
   - Verify `NEXT_PUBLIC_ADMIN_UID` matches your user ID
   - Check user authentication status

3. **Build Errors**
   - Run `npm run lint` to check for TypeScript errors
   - Ensure all dependencies are installed

## 📈 Future Enhancements

- [ ] Email notifications for appointments
- [ ] Payment integration
- [ ] Calendar sync
- [ ] SMS reminders
- [ ] Analytics dashboard
- [ ] Multi-location support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is private and proprietary to YVD Nails salon.

## 📞 Support

For technical support or questions, contact the development team.

---

**YVD Nails** - Premium Eyelashes & Nail Artistry
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

This project uses sequelize, bcryptjs, jsonwebtoken, validator, and dotenv. 
npm install sequelize pg dotenv bcryptjs jsonwebtoken validator

The sequelize library needs both the main pg driver and the pg-hstore package to handle all of PostgreSQL's data types correctly.
npm install pg-hstore
npm install pg