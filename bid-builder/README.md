# Construction Bid Builder

A professional bid and proposal builder specifically designed for glazing contractors. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🏗️ Features

- **Professional Proposals**: Create winning bids in minutes, not hours
- **Smart Pricing**: Built-in pricing database and calculations
- **Professional PDFs**: Generate branded, professional PDFs
- **Mobile Responsive**: Works perfectly on all devices
- **Construction Industry Design**: Professional blue and steel gray color palette

## 🚀 Tech Stack

- **Next.js 14** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS v4** with construction industry colors
- **ESLint** and **Prettier** for code quality
- **Supabase** integration ready

## 🎨 Design System

### Construction Industry Color Palette

- **Primary**: Professional blue (#1e40af - #2563eb)
- **Secondary**: Steel gray (#f8fafc - #1e293b)
- **Accent**: Construction orange (#ea580c - #f97316)
- **Success**: Green (#059669)
- **Warning**: Yellow (#d97706)
- **Error**: Red (#dc2626)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ArcadeBob/construction-bid-builder.git
cd bid-builder

# Install dependencies
npm install

# Set up environment variables (see Supabase Setup below)
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

## 🗄️ Supabase Setup

This application uses Supabase for authentication, database, and storage. Follow these steps to set up your Supabase project:

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `bid-builder`
   - **Database Password**: Generate a secure password
   - **Region**: Choose the closest to your users
5. Click "Create new project"

### 2. Get Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

### 3. Configure Environment Variables
Create a `.env.local` file in the project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Application Configuration
NEXT_PUBLIC_APP_NAME="Construction Bid Builder"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### 4. Test Connection
After setup, test your Supabase connection:

```bash
# Start the development server
npm run dev

# In another terminal, test the connection
curl http://localhost:3000/api/test-connection
```

You should see a success response indicating Supabase is connected.

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Start production server
npm start
```

## 📁 Project Structure

```
bid-builder/
├── src/
│   └── app/
│       ├── globals.css          # Construction industry styling
│       ├── layout.tsx           # Root layout with metadata
│       └── page.tsx             # Landing page
├── public/                      # Static assets
├── tailwind.config.ts           # Construction color palette
├── tsconfig.json               # TypeScript configuration
├── .prettierrc                 # Code formatting rules
├── .env.local.example          # Environment variables template
└── package.json                # Dependencies and scripts
```

## 🌐 Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
NEXT_PUBLIC_APP_NAME="Construction Bid Builder"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

## 🎯 Target Audience

Built specifically for:
- **Glazing Contractors**
- **Storefront Contractors**
- **Construction Companies**
- **Bid and Proposal Teams**

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Professional layout on all screen sizes

## 🔒 Type Safety

- TypeScript strict mode enabled
- Full type checking
- IntelliSense support

## 🚀 Deployment

Ready for deployment on:
- Vercel
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue on GitHub.

---

Built with ❤️ for the construction industry
