SQA Dashboard

🚀 Project Overview

The SQA Dashboard is a full-stack application designed to streamline Software Quality Assurance (SQA) tracking and reporting. It provides a centralized interface for managing testing projects, tracking test case execution, monitoring defect lifecycles, and visualizing key quality metrics.

This repository contains two main components:

sqa-frontend/: The client-side application (built with React).

sqa-backend/: The server-side API (built with Node.js/Express) responsible for business logic and database communication.

🛠️ Technology Stack

Frontend: React

Backend: Node.js, Express

Database: MongoDB

💻 Local Development Setup

Follow these steps to get the SQA Dashboard running on your local machine.

Prerequisites

Node.js (LTS version recommended)

npm or yarn

A running instance of MongoDB

Step 1: Clone the Repository

Clone this repository to your local machine:

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd SQA_Dashboard



Step 2: Install Dependencies

You must install dependencies for both the backend and the frontend.

# Install backend dependencies
cd sqa-backend
npm install

# Install frontend dependencies
cd ../sqa-frontend
npm install

# Return to the root directory
cd ..



Step 3: Configure Environment Variables

The backend relies on environment variables, especially for the database connection.

Create the environment file:
In the sqa-backend/ directory, create a new file named .env.

Add Configuration:
Populate the .env file with the necessary configuration details. At a minimum, you will need the database connection string:

# --- REQUIRED FOR DATABASE CONNECTION ---
# Replace <username>, <password>, and <cluster_url> with your actual MongoDB details.
# If using a local MongoDB instance, the URL might look like: mongodb://localhost:27017/sqa_dashboard_db
MONGO_URI=mongodb+srv://<username>:<password>@<cluster_url>/sqa_dashboard_db?retryWrites=true&w=majority

# --- OPTIONAL SERVER CONFIGURATION ---
PORT=5000
JWT_SECRET=a_very_secret_key_for_auth # IMPORTANT: Use a long, random string



Step 4: Run the Application

A. Start the Backend Server

From the sqa-backend/ directory:

npm run dev # (or 'npm start', depending on your package.json)

The backend should start, typically on http://localhost:5000.

B. Start the Frontend Application

From the sqa-frontend/ directory:

npm start

The frontend application will typically open in your web browser at http://localhost:3000.
