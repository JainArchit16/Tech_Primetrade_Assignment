# Trading Intel Dashboard

A modern, full-stack web application designed for crypto-native analysts to manage intelligence data. Built with Next.js 14, this project features secure JWT authentication, a responsive grid-themed UI, and real-time CRUD operations.

## Features

* **Authentication**: Secure Register/Login flow using JWT stored in HTTP-Only cookies.
* **Dashboard**: Protected route for managing intelligence tasks (CRUD).
* **Profile Management**: View and update user details (Name, Gender).
* **Search**: Real-time filtering of intelligence data.
* **Design**: "Crypto-native" aesthetic with a dark mode grid background, glassmorphism effects, and responsive layout.
* **Security**: Password hashing (Bcrypt), Token verification (Jose), and API route protection.

## Tech Stack

* **Framework**: Next.js 14 (App Router)
* **Language**: JavaScript / Node.js
* **Database**: MongoDB (Mongoose ODM)
* **Styling**: Tailwind CSS + Lucide Icons
* **Auth**: JWT (Jose) + Bcrypt.js

## Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB Connection String (Atlas or Local)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JainArchit16/Tech_Primetrade_Assignment
    cd Tech_Primetrade_Assignment
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secure_random_string
    ```

4.  **Run the application:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

The API collection is available in `trading_intel_api.json` (Postman format).

| Method | Endpoint             | Description              | Protected |
| :----- | :------------------- | :----------------------- | :-------- |
| POST   | `/api/auth/register` | Create a new account     | No        |
| POST   | `/api/auth/login`    | Login & set HttpOnly cookie | No     |
| POST   | `/api/auth/logout`   | Clear session cookie     | Yes       |
| GET    | `/api/auth/me`       | Fetch current user profile | Yes     |
| PUT    | `/api/auth/me`       | Update user profile      | Yes       |
| GET    | `/api/tasks`         | Fetch user's tasks       | Yes       |
| POST   | `/api/tasks`         | Create a new task        | Yes       |
| DELETE | `/api/tasks`         | Delete a task by ID      | Yes       |

---

## Production Scalability Strategy

*(Deliverable Item #5)*

To scale this application from a prototype to a production-grade system handling 100k+ users, I would implement the following architecture changes:

### 1. Frontend & CDN Layer
* **Edge Caching**: Deploy the Frontend on Vercel or AWS CloudFront. Static assets and ISR (Incremental Static Regeneration) pages would be cached at the edge to reduce server load.
* **State Management**: Integrate **TanStack Query (React Query)** to handle server state, caching, and optimistic updates, reducing unnecessary API calls.

### 2. Backend & Microservices
* **Decoupling**: Currently, the API lives inside Next.js. For scale, I would migrate heavy logic (e.g., data analysis, notification systems) into separate **Node.js/Go microservices** communicating via gRPC or message queues (RabbitMQ/Kafka).
* **Serverless**: Utilize AWS Lambda for burstable workloads (like processing large batch uploads of trading data) to save costs and auto-scale instantly.

### 3. Database & Caching
* **Caching Layer**: Implement **Redis** to cache user sessions, frequently accessed dashboard data, and API responses. This prevents hitting MongoDB for every request.
* **Database Optimization**:
    * **Indexing**: rigorous indexing on fields like `userId` and `createdAt`.
    * **Sharding**: If data grows beyond terabytes, shard MongoDB based on `userId` or `region`.
    * **Read Replicas**: Separate Read/Write operations to distribute load.

### 4. Security & Compliance
* **Rate Limiting**: Implement Redis-based rate limiting (using Upstash or similar) to prevent DDoS attacks on API routes.
* **WAF**: Put the application behind Cloudflare to handle bot protection.
