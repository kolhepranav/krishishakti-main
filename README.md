<div align="center">
  <br />
    <a href="https://youtu.be/dGHFV_RMGag" target="_blank">
      <img src="https://i.postimg.cc/tJsYLQcP/test1.jpg" alt="Project Banner">
    </a>
  
  <br />

  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

  <h3 align="center">Finan Smart</h3>

   <div align="center">
     Build this project step by step with our detailed tutorial on <a href="https://www.youtube.com/@albertmends" target="_blank"><b>Your YouTube Channel</b></a>. Join the community!
    </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 🕸️ [Assets & Code](#snippets)
6. 🚀 [More](#more)

## 🚨 Tutorial

This repository contains the code corresponding to an in-depth tutorial available on our YouTube channel, <a href="https://www.youtube.com/@albertmends/videos" target="_blank"><b>Code with Albert</b></a>.

If you prefer visual learning, this is the perfect resource for you. Follow our tutorial to learn how to build projects like these step-by-step in a beginner-friendly manner!

## <a name="introduction">🤖 Introduction</a>

Built with the latest Next.js and TypeScript, Finan Smart is an advanced AI financial advice tool. It allows users to input their income, expenses, and budgets, and receive personalized financial advice based on their financial data. This project is perfect for those looking to learn how to integrate AI-driven insights and financial management into a Next.js application.

If you're getting started and need assistance or face any bugs, join our active Discord community. It's a place where people help each other out.

<a href="https://discord.com/channels/1221368900579754074/1221368901162631243" target="_blank"><img src="https://github.com/sujatagunale/EasyRead/assets/151519281/618f4872-1e10-42da-8213-1d69e486d02e"  /></a>

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- TypeScript
- OpenAI API
- Tailwind CSS

## <a name="features">🔋 Features</a>

👉 **Income and Expense Input**: Allows users to input their income and expenses.

👉 **Budget Management**: Enables users to manage their budgets effectively.

👉 **Personalized Financial Advice**: Provides detailed financial advice based on user-specific financial data using OpenAI's GPT-4 model.

👉 **Responsive Design**: Ensures a seamless experience across different devices.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

   ```bash
   git clone https://github.com/KaranGulve4342/krishishakti.git
   cd krishishakti
   ```

2. **Install Dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Using Yarn:

   ```bash
   yarn install
   ```

### Configuration

1. **Environment Variables:**

   Create a `.env.local` file in the root directory and add the following environment variables:

   ```env
   NEXT_PUBLIC_DATABASE_URL=your_neondb_connection_string
   CLERK_API_KEY=your_clerk_api_key
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```

2. **Database Setup:**

   Ensure your NeonDB database is set up and the connection string is correctly configured in the `.env.local` file.

3. **Drizzle ORM Configuration:**

   Ensure `drizzle.config.js` is correctly set up in the project root.

### Running the Project

1. **Start the Development Server:**

   Using npm:

   ```bash
   npm run dev
   ```

   Using Yarn:

   ```bash
   yarn dev
   ```

2. **View the Application:**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
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
```

## Scripts

- **`dev`**: Runs the application in development mode.
- **`build`**: Builds the application for production.
- **`start`**: Starts the production server.
- **`lint`**: Runs ESLint to check for code quality issues.
- **`db:push`**: Pushes database schema changes using Drizzle Kit.
- **`db:studio`**: Launches Drizzle Kit Studio for database management.

## Usage

### Navigation

- **Sidebar:** Accessible on all dashboard pages for seamless navigation between different sections like Dashboard, Incomes, Budgets, Expenses, and Upgrade.
- **Header:** Displays user information and a responsive menu for accessing different features.

### Features

- **Crop Recommendation:** Navigate to the Crop Recommendation tab to get intelligent suggestions for crops based on your input data.
- **Fertilizer Recommendation:** Access fertilizer optimization tools to enhance crop yield and soil health.
- **Disease Prediction:** Utilize the Disease Prediction feature to identify and manage plant diseases early.

## Contributing

We welcome contributions to KrishiShakti! If you have suggestions, bug reports, or would like to contribute code, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Description of changes"
   ```

4. Push to your branch:

   ```bash
   git push origin feature-name
   ```

5. Submit a pull request.