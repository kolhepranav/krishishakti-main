# KrishiShakti

## Overview

KrishiShakti is a comprehensive agricultural management platform designed to empower farmers with advanced tools for crop recommendation, fertilizer optimization, and disease prediction. Leveraging modern technologies like Next.js, Drizzle ORM, and NeonDB, KrishiShakti ensures a seamless and responsive user experience across all devices.

## Features

- *Responsive Design:* Optimized for both desktop and mobile devices to ensure accessibility and ease of use.
- *User Authentication:* Secure authentication and user management powered by [Clerk](https://clerk.dev/).
- *Crop Recommendation:* Intelligent crop suggestions based on soil and climatic data.
- *Fertilizer Optimization:* Tailored fertilizer recommendations to maximize yield and soil health.
- *Disease Prediction:* Early detection of plant diseases using advanced prediction algorithms.
- *Dynamic Navigation:* Intuitive sidebar and header navigation for easy access to different features.
- *Database Integration:* Efficient data management with [Drizzle ORM](https://drizzle.team/) and [NeonDB](https://neondatabase.com/).
- *Interactive UI Components:* Built with [Radix UI](https://www.radix-ui.com/) and [Lucide React](https://lucide.dev/).

## Technologies Used

- *Framework:* [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation.
- *Language:* [React](https://reactjs.org/) with [JavaScript](https://www.javascript.com/) and [JSX](https://reactjs.org/docs/introducing-jsx.html).
- *Styling:* [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
- *Authentication:* [Clerk](https://clerk.dev/) for user authentication and management.
- *ORM:* [Drizzle ORM](https://drizzle.team/) for type-safe SQL queries.
- *Database:* [NeonDB](https://neondatabase.com/) - Serverless PostgreSQL database.
- *UI Components:* [Radix UI](https://www.radix-ui.com/) and [Lucide React](https://lucide.dev/) for accessible and customizable UI components.
- *State Management & Data Fetching:* [SWR](https://swr.vercel.app/) for efficient data fetching and caching.

## Getting Started

### Prerequisites

- *Node.js:* Install the latest LTS version from [Node.js](https://nodejs.org/).
- *npm or Yarn:* Package manager for installing dependencies.

### Installation

1. *Clone the Repository:*

   bash
   git clone https://github.com/KaranGulve4342/krishishakti.git
   cd krishishakti
   

2. *Install Dependencies:*

   Using npm:

   bash
   npm install
   

   Using Yarn:

   bash
   yarn install
   

### Configuration

1. *Environment Variables:*

   Create a .env.local file in the root directory and add the following environment variables:

   env
   NEXT_PUBLIC_DATABASE_URL=your_neondb_connection_string
   CLERK_API_KEY=your_clerk_api_key
   NEXT_PUBLIC_API_URL=your_backend_api_url
   

2. *Database Setup:*

   Ensure your NeonDB database is set up and the connection string is correctly configured in the .env.local file.

3. *Drizzle ORM Configuration:*

   Ensure drizzle.config.js is correctly set up in the project root.

### Running the Project

1. *Start the Development Server:*

   Using npm:

   bash
   npm run dev
   

   Using Yarn:

   bash
   yarn dev
   

2. *View the Application:*

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure


krishishakti/
|
├── app/
│   └── (routes)/
│       └── dashboard/
│           ├── _components/
│           │   ├── SideNav.jsx
│           │   ├── Header.jsx
│           │   ├── CropRecommendation.jsx
│           │   ├── FertilizerRecommendation.jsx
│           │   └── DiseasePrediction.jsx
│           ├── krishiniyojak/
│           │   └── page.jsx
│           └── krishirakshak/
│               └── page.jsx
│
├── components/
│   └── ui/
│       ├── button.jsx
│       ├── dropdown-menu.jsx
│       └── tabs.jsx
│
├── lib/
│   └── GoogleTranslate.js
│
├── public/
│   └── chart-donut.svg
│
├── styles/
│   └── globals.css
│
├── utils/
│   ├── dbConfig.jsx
│   └── schema.jsx
│
├── .env.local
├── package.json
├── drizzle.config.js
├── README.md
└── next.config.js


## Scripts

- **dev**: Runs the application in development mode.
- **build**: Builds the application for production.
- **start**: Starts the production server.
- **lint**: Runs ESLint to check for code quality issues.
- **db:push**: Pushes database schema changes using Drizzle Kit.
- **db:studio**: Launches Drizzle Kit Studio for database management.

## Usage

### Navigation

- *Sidebar:* Accessible on all dashboard pages for seamless navigation between different sections like Dashboard, Incomes, Budgets, Expenses, and Upgrade.
- *Header:* Displays user information and a responsive menu for accessing different features.

### Features

- *Crop Recommendation:* Navigate to the Crop Recommendation tab to get intelligent suggestions for crops based on your input data.
- *Fertilizer Recommendation:* Access fertilizer optimization tools to enhance crop yield and soil health.
- *Disease Prediction:* Utilize the Disease Prediction feature to identify and manage plant diseases early.

## Contributing

We welcome contributions to KrishiShakti! If you have suggestions, bug reports, or would like to contribute code, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:

   bash
   git checkout -b feature-name
   

3. Commit your changes:

   bash
   git commit -m "Description of changes"
   

4. Push to your branch:

   bash
   git push origin feature-name
   

5. Submit a pull request.