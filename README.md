# Humanaira - Premium AI Marketplace

A modern, premium marketplace platform for AI services and digital talent, featuring real-time chat powered by Twilio and a beautiful AI-powered search experience.

## 🌟 Features

### Core Functionality
- **AI Service Marketplace**: Browse, search, and purchase AI services from freelancers
- **Real-time Chat**: Twilio-powered messaging with typing indicators and file attachments
- **AI-Powered Search**: Smart search modal with category suggestions and quick prompts
- **Payment Integration**: Stripe-powered secure payments with escrow
- **Service Packages**: Multiple tiers with custom features and pricing
- **User Profiles**: Seller and buyer profiles with ratings and reviews

### Premium UI/UX
- **Modern Design**: Gradient backgrounds, smooth animations, glassmorphism effects
- **Responsive**: Fully responsive design for mobile, tablet, and desktop
- **Custom Scrollbars**: Beautiful gradient scrollbars throughout
- **Dark Theme**: Sleek dark theme with blue (#35BFFF) accent colors
- **Micro-interactions**: Hover effects, transitions, and loading states

### Chat Features
- ✅ Real-time messaging (Twilio + Supabase fallback)
- ✅ Typing indicators
- ✅ File attachments (images and videos)
- ✅ Payment requests within chat
- ✅ Message history and persistence
- ✅ Conversation management
- ✅ Premium chat UI with gradient bubbles

### AI Search Features
- ✅ Natural language search
- ✅ 8 popular category quick links
- ✅ 6 pre-built search prompts
- ✅ Smart routing to browse page
- ✅ Beautiful modal with animations
- ✅ Pro tips for better results

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account (for payments)
- Twilio account (optional, for enhanced chat)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/judealsakarneh/humanaira.git
   cd humanaira
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies
   npm install
   
   # Client dependencies
   cd client
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.local .env.local
   ```

   Required variables:
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   
   # Twilio (Optional - falls back to Supabase if not set)
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_API_KEY=your_api_key
   TWILIO_API_SECRET=your_api_secret
   TWILIO_CHAT_SERVICE_SID=your_service_sid
   ```

4. **Run database migrations**
   
   Execute the SQL files in `database/migrations/` in your Supabase SQL editor:
   ```bash
   # Run in Supabase SQL Editor
   database/migrations/001_add_twilio_conversation_sid.sql
   ```

5. **Start development servers**
   ```bash
   # Terminal 1: Upload server
   npm run dev
   
   # Terminal 2: Next.js client
   cd client
   npm run dev
   ```

6. **Open the app**
   ```
   http://localhost:3000
   ```

## 📚 Documentation

- [Twilio Setup Guide](./TWILIO_SETUP.md) - Detailed Twilio integration instructions
- [Database Migrations](./database/migrations/) - SQL migration files
- [API Routes](./client/src/app/api/) - Backend API documentation

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 15.5.2 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion (animations)

**Backend:**
- Next.js API Routes
- Supabase (Database, Auth, Realtime)
- Stripe (Payments)
- Twilio Conversations API (Chat)

**Infrastructure:**
- Vercel (Hosting - recommended)
- Supabase (Backend as a Service)
- Twilio (Chat Service)

### Project Structure

```
humanaira/
├── client/                  # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   │   ├── api/        # API routes
│   │   │   ├── messages/   # Messages page
│   │   │   ├── services/   # Service pages
│   │   │   └── page.tsx    # Homepage
│   │   ├── components/     # React components
│   │   │   ├── messages/   # Chat components
│   │   │   └── AISearchModal.tsx
│   │   ├── contexts/       # React contexts
│   │   │   └── TwilioChatContext.tsx
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json
├── database/
│   └── migrations/         # SQL migrations
├── server.js               # Upload server
├── TWILIO_SETUP.md        # Twilio setup guide
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: #35BFFF (Bright Blue)
- **Secondary**: #2A9FE6 (Medium Blue)
- **Background**: #070D1C to #0A0F1E (Dark gradients)
- **Surface**: #0D1328 to #0B1024 (Card backgrounds)
- **Text**: White to Slate-300

### Typography
- **Headings**: Poppins (900 weight)
- **Body**: Inter (400-600 weight)
- **Accent**: Pacifico (handwritten)

### Components
- Gradient backgrounds with blur effects
- Rounded corners (rounded-xl, rounded-2xl)
- Subtle border glow effects
- Custom gradient scrollbars
- Smooth transitions (300ms default)

## 🔧 Configuration

### Twilio Chat
See [TWILIO_SETUP.md](./TWILIO_SETUP.md) for detailed setup instructions.

**Fallback Mode:**
If Twilio credentials are not configured, the app automatically uses Supabase Realtime for messaging with slightly reduced features (no typing indicators).

### Supabase Setup
1. Create tables: `conversations`, `messages`, `payment_requests`, `gigs`, `profiles`
2. Enable Realtime on required tables
3. Set up Row Level Security (RLS) policies
4. Configure Storage buckets for file uploads

### Stripe Setup
1. Get API keys from Stripe Dashboard
2. Set up webhook endpoint: `/api/stripe/webhook`
3. Configure webhook events: `checkout.session.completed`, `payment_intent.succeeded`

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to vercel.com
   - Import your repository
   - Configure environment variables
   - Deploy

3. **Configure Webhooks**
   - Update Stripe webhook URL to your Vercel domain
   - Test webhooks in Stripe Dashboard

### Environment Variables
Make sure to set all required environment variables in Vercel dashboard under Project Settings → Environment Variables.

## 🧪 Testing

### Manual Testing Checklist

**Chat Features:**
- [ ] Send message as buyer
- [ ] Receive message as seller
- [ ] Upload image attachment
- [ ] Request payment
- [ ] Process payment
- [ ] Typing indicators work (Twilio mode)

**Search Features:**
- [ ] Regular search works
- [ ] AI search modal opens
- [ ] Category selection works
- [ ] Quick prompts work
- [ ] Search results appear

**General:**
- [ ] User registration
- [ ] User login
- [ ] Service browsing
- [ ] Checkout flow
- [ ] Mobile responsiveness

## 🐛 Troubleshooting

### Build Issues

**"Module not found" errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Next.js cache issues:**
```bash
rm -rf .next
npm run build
```

### Chat Issues

**Messages not appearing:**
1. Check browser console for errors
2. Verify Supabase Realtime is enabled
3. Check RLS policies
4. Ensure user is authenticated

**Twilio connection fails:**
1. Verify environment variables
2. Check Twilio Console for errors
3. Test API credentials
4. Try fallback mode (remove Twilio vars)

### Database Issues

**Table not found:**
```bash
# Run migrations in Supabase SQL Editor
```

**RLS policies blocking access:**
```sql
-- Temporarily disable RLS for testing
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
-- Re-enable and fix policies after testing
```

## 📝 License

This project is proprietary. All rights reserved.

## 🤝 Contributing

This is a private project. For access or questions, contact the repository owner.

## 📧 Support

For support, email hello@humanaira.com or open an issue on GitHub.

## 🎯 Roadmap

### Completed ✅
- Real-time chat with Twilio
- AI-powered search
- Premium UI redesign
- Payment integration
- Service marketplace

### In Progress 🚧
- Mobile app (React Native)
- Seller analytics dashboard
- Review and rating system
- Advanced AI recommendations

### Planned 📋
- Video calls (Twilio Video)
- Multi-language support
- Advanced search filters
- Seller verification system
- Affiliate program

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for backend infrastructure
- Twilio for chat capabilities
- Vercel for hosting
- The open-source community

---

Made with ❤️ by the Humanaira team
