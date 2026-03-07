# 2026DevHack - Healthcare Management System

A comprehensive healthcare management platform built with Next.js that enables clinics and patients to manage medical records, vaccinations, and patient care efficiently.

## Overview

2026DevHack is a full-stack healthcare application designed to streamline patient management, immunization tracking, medical history documentation, and clinic operations. It provides secure access control, patient eligibility management, and automated notification systems for healthcare providers and patients.

## Features

### Patient Management

- **Patient Profiles** - Complete patient information and demographics
- **Medical History** - Comprehensive medical records and history tracking
- **Immunization Timeline** - Visual timeline of vaccinations and immunizations
- **Eligibility Checking** - Patient eligibility verification and management
- **Patient Search** - Quick search and lookup of patient records

### Clinic Operations

- **Clinic Dashboard** - Overview of clinic operations and patient statistics
- **Patient Management** - View and manage clinic patients
- **Document Access Control** - Manage permissions for medical documents
- **Family Management** - Track family relationships and dependencies

### Authentication & Security

- **Multi-role Login** - Separate authentication for clinics and patients
- **Access Tokens** - Generate, validate, and revoke access tokens
- **Secure API Endpoints** - Protected routes with authentication validation

### Notifications & Reminders

- **Notification System** - Email and SMS notifications
- **Reminder Management** - Automated reminders for vaccinations and appointments
- **Notification Preferences** - Customizable notification settings

### Additional Features

- **Patient Registration** - Self-service patient account creation
- **Account Management** - User account and preference settings
- **Data Table Components** - Flexible data display and management

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) with TypeScript
- **Styling**: PostCSS, Tailwind CSS
- **Database**: MongoDB
- **UI Components**: Custom shadcn/ui-based components
- **Tools**: ESLint for code quality

## Project Structure

```
2026DevHack/
├── app/                    # Next.js App Router
│   ├── api/               # API routes and endpoints
│   │   ├── access/        # Token access management
│   │   ├── auth/          # Authentication endpoints
│   │   ├── patient/       # Patient-related APIs
│   │   ├── clinic/        # Clinic-related APIs
│   │   ├── notifications/ # Notification services
│   │   └── reminders/     # Reminder services
│   ├── dashboard/         # Patient dashboard pages
│   ├── clinic/            # Clinic management pages
│   ├── login/             # Authentication pages
│   └── register/          # Registration pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── clinic/           # Clinic-specific components
│   └── [Feature]/        # Feature-specific components
├── lib/                   # Utility functions and helpers
│   ├── reminders/        # Reminder logic
│   ├── vaccines/         # Vaccine management utilities
│   ├── mock/             # Mock data for development
│   └── models/           # TypeScript models
├── hooks/                 # Custom React hooks
├── data/                  # Static data files
├── models/               # Database models
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd 2026DevHack
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory with necessary environment variables:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production bundle
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## API Endpoints

### Authentication

- `POST /api/auth/clinic` - Clinic login
- `POST /api/auth/patient` - Patient login

### Patient Management

- `GET /api/patient/search` - Search patients
- `GET /api/patient/eligibility` - Check patient eligibility

### Access Control

- `POST /api/access/generate` - Generate access token
- `POST /api/access/revoke` - Revoke access token
- `GET /api/access/validate` - Validate access token

### Notifications & Communication

- `POST /api/notifications` - Send notifications
- `POST /api/send-email` - Send email messages
- `POST /api/send-sms` - Send SMS messages

## Database Models

- **Patient** - Patient records and information
- **Clinic** - Clinic information and settings
- **Vaccine** - Vaccine catalog and records
- **AccessToken** - Access control tokens

## Development Guidelines

### Component Organization

- UI components are located in `/components/ui/`
- Feature-specific components are in their respective feature directories
- Reusable hooks are in `/hooks/`

### Styling

- Uses Tailwind CSS for styling
- PostCSS for processing
- Component-level styling with CSS modules where needed

### Database Connection

- MongoDB integration through `/lib/mongodb.ts`
- Models defined in `/models/` directory

## Deployment

### Deploy on Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy with a single click

### Other Deployment Options

- **Docker**: Create a Dockerfile for containerized deployment
- **Self-hosted**: Deploy to your own server using the production build
- **Other platforms**: AWS, GCP, Azure, Heroku, etc.

## Contributing

1. Create a feature branch (`git checkout -b feature/feature-name`)
2. Commit your changes (`git commit -m 'Add feature'`)
3. Push to the branch (`git push origin feature/feature-name`)
4. Open a Pull Request

## Support

For issues, questions, or suggestions, please open an issue in the repository or contact the development team.

## License

[Add appropriate license information]
