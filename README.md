# 🏢 Batima-Gest

Batima-Gest is a modern, comprehensive SaaS platform designed to streamline building and property management. It provides a seamless interface for administrators to manage their properties and for residents to stay informed, submit maintenance requests, and access important documents.

## ✨ Features

- **Role-Based Access Control**: Secure separation between Administrator and Resident privileges.
- **Interactive Dashboard**: At-a-glance metrics for urgent announcements and active maintenance requests.
- **Community Board**: Admins can broadcast announcements, and optionally pin important ones to the top.
- **Maintenance Management**: Residents can submit tickets; admins can track and update the status (Pending, In Progress, Resolved).
- **Document Hub**: Secure storage for building rules, financial reports, and meeting minutes.
- **User Management**: Admins can view, edit, or remove residents, as well as upgrade users to Admin status.
- **Profile Customization**: Users can update their personal details and upload custom profile avatars.

## 💻 Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), React 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **Storage**: Supabase Storage Buckets (for documents and avatars)

## 🛠️ Local Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A [Supabase](https://supabase.com) account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/batima-gest.git
cd batima-gest/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the `frontend` directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 4. Supabase Configuration
Run the provided SQL scripts in your Supabase SQL Editor to generate the tables, Row Level Security (RLS) policies, and automatic Auth triggers.
Ensure you have created two **Public** Storage Buckets in your Supabase dashboard:
- `avatars`
- `documents`

### 5. Run the Application

```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🔒 Security

All data is protected using **Supabase Row Level Security (RLS)**. Residents can only view, create, or modify their own data (like their maintenance requests and profiles), while Administrators have global visibility and management capabilities.

## 👨‍💻 Contributing
Feel free to open issues or submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
