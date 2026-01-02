# Task Management App

A modern, full-stack Task Management application built with **Next.js 14+** (App Router), **MongoDB**, and **Cloudinary**. This project demonstrates server-side logic using Server Actions, robust authentication, and media handling.

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account for file uploads

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd task
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # MongoDB Connection String (e.g., from MongoDB Atlas)
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/todo-app

    # NextAuth Configuration
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your-super-secret-key-here

    # Cloudinary Credentials (found in your Cloudinary Dashboard)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗 Project Architecture

This project leverages the **Next.js App Router** for a modern, server-first approach.

-   **Frontend & Backend**: Next.js serves as both. The UI is built with React Server Components (RSC) by default, while user interactions (like forms) trigger **Server Actions**.
-   **Server Actions**: Instead of traditional API routes (e.g., `/api/todos`), this project uses Server Actions (defined in `src/app/actions.js`) to handle data mutations directly from the server. This reduces client-side JavaScript and simplifies data flow.

## 🛠 Key Technologies & Integration

### 1. MongoDB (Database)
The project uses two approaches to connect to MongoDB, serving different purposes:

*   **Mongoose (`src/lib/db.js`)**:
    *   **Usage**: Used for application data logic (creating, reading, updating, deleting todos).
    *   **Why**: Mongoose provides Schema validation and a rich API for data modeling. The `dbConnect` helper ensures a cached database connection is reused across hot reloads in development and serverless function invocations in production.
    *   **Models**: Defined in `src/models/`, e.g., `Todo`.

*   **Native MongoDB Driver (`src/lib/mongodb.js`)**:
    *   **Usage**: Primarily used by **NextAuth.js** (via `@next-auth/mongodb-adapter`).
    *   **Why**: NextAuth adapters typically require a raw MongoClient promise rather than a Mongoose object. This ensures authentication sessions are stored efficiently without the overhead of ODM validation.

### 2. Cloudinary (Media Storage)
File uploads are handled securely using **Cloudinary**.

*   **Implementation**: Logic resides in `src/app/actions.js`.
*   **Workflow**:
    1.  User selects a file in a form.
    2.  The file is passed to a Server Action (`createTodo` or `updateTodo`) as `FormData`.
    3.  The server converts the file to a buffer and streams it directly to Cloudinary using their Node.js SDK (`cloudinary.uploader.upload_stream`).
    4.  Cloudinary returns a secure URL, which is then saved to the MongoDB `Todo` document.
*   **Dependencies**: Requires `cloudinary` npm package.

### 3. NextAuth.js (Authentication)
*   **Security**: Handles user sessions and protection of routes.
*   **Storage**: Users and Sessions are stored in MongoDB using the adapter configuration.
*   **Integration**: Helper functions like `getServerSession` are used in Server Actions to ensure only the owner of a todo can view or modify it.
