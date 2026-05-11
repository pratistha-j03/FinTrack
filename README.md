# 💸 FinTrack | High-Performance Financial Analytics Suite

**FinTrack** is a high-performance MERN-stack application engineered for real-time personal finance management. Beyond basic CRUD, this platform utilizes advanced database optimization to provide instantaneous financial insights and community-driven benchmarking.

---

## ⚡ Engineering Highlights (Internship Focus)

* **Optimized Analytics Engine:** Migrated complex financial computations from the frontend to **MongoDB Aggregation Pipelines**, resulting in an **80% reduction in dashboard latency** (from 1000ms to 200ms).
* **Privacy-Preserving Benchmarking:** Engineered a **Spending Comparison** feature using `$facet` aggregations to compute anonymous community spending averages without compromising individual user data.
* **Scalable Data Modeling:** Designed a user-isolated schema architecture to ensure 100% data integrity and security for sensitive financial records.

---

## 🚀 Key Features

### 📊 Intelligent Dashboard
* **Real-time Aggregations:** Instant breakdown of income vs. expenses and category-wise spending via server-side processing.
* **Community Benchmarking:** Compare monthly spending habits against the anonymous community average.
* **Dynamic Filtering:** High-speed server-side filtering by month, year, and transaction category.

### 🔐 Secure Infrastructure
* **JWT & Bcrypt:** Industry-standard authentication and password hashing for secure session management.
* **Middleware Authorization:** Custom-built security layers ensuring user-scoped data isolation.

### 🧾 Budgeting & Goal Tracking
* **Visual Spending Limits:** Visual indicators for budget thresholds using data-driven insights.
* **Automated Balance Tracking:** Real-time calculation of net savings and liquidity across multiple timeframes.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js |
| **DevOps** | Git, Postman, Vercel/Render |

---

## 📈 Performance Benchmarks

| Operation | Previous (Frontend Logic) | Current (Aggregation Pipeline) | Improvement |
| :--- | :--- | :--- | :--- |
| Dashboard Load | ~1000ms | **200ms** | **5x Faster** |
| Data Calculation | Client-side (Heavy) | **Server-side (Optimized)** | **Lower CPU Usage** |

---
