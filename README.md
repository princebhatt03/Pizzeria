# 🍕 Real-Time Pizza Delivery Website

A Full-Stack Real-Time Pizza Ordering and Delivery Web Application built using **Node.js**, **Express.js**, **MongoDB**, **EJS**, and **Tailwind CSS**. It supports user and admin login, real-time order tracking, and a fully functional admin dashboard for managing multiple orders simultaneously.

---

## 📌 Live Demo

👉 [Link(https://pizza-ria.onrender.com)]

---

## 🛠️ Tech Stack

### 🔧 Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io (for real-time communication)

### 🎨 Frontend:
- EJS (Embedded JavaScript Templates)
- Tailwind CSS

### 🛡️ Authentication & Security:
- Express-Session
- bcrypt (for password hashing)
- Role-based access control (User / Admin)

---

## 📷 Screenshot

![s3](https://github.com/user-attachments/assets/5f2f63f2-c7d8-4e4b-982e-29c3c559e81e)


## ✨ Key Features

### 👤 User Side:
- User Registration & Login
- Browse Pizza Menu
- Add/Remove Pizzas to/from Cart
- Place Orders
- Real-time Order Status Updates
- Order History View

### 🧑‍💼 Admin Side:
- Admin Login
- Manage Orders in Real-Time
- Change Order Status (e.g., Placed ➝ Prepared ➝ Delivered)
- View All Orders with Timestamps and User Info

### 🔁 Real-Time Functionality:
- WebSockets via **Socket.io**
- Live updates when admin changes order status
- Admin dashboard auto-refreshes with new orders

---

## 📁 Folder Structure

```
pizza-delivery-app/
│
├── public/                      # Static assets like CSS, JS, images
│   ├── css/
│   ├── js/
│   └── images/
│
├── src/                         # Main application source code
│   ├── config/                  # DB connection and environment configs
│   │   └── db.js
│   │
│   ├── controllers/             # Route controllers (business logic)
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   │
│   ├── models/                  # Mongoose models
│   │   ├── user.model.js
│   │   ├── order.model.js
│   │   └── pizza.model.js
│   │
│   ├── routes/                  # All route definitions
│   │   ├── index.js
│   │   ├── user.routes.js
│   │   └── admin.routes.js
│   │
│   ├── services/                # Custom services (middleware, sockets)
│   │   ├── socketService.js
│   │   └── authMiddleware.js
│   │
│   ├── utils/                   # Utility/helper functions
│   │   └── timeFormatter.js
│   │
│   ├── views/                   # EJS templates
│   │   ├── layouts/
│   │   │   └── main.ejs
│   │   ├── partials/
│   │   │   ├── header.ejs
│   │   │   └── footer.ejs
│   │   ├── users/
│   │   │   ├── login.ejs
│   │   │   ├── register.ejs
│   │   │   ├── menu.ejs
│   │   │   └── orderStatus.ejs
│   │   └── admin/
│   │       └── dashboard.ejs
│   │
│   ├── app.js                   # Entry point (Express setup)
│   └── server.js                # Server initialization with Socket.io
│
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚦 How It Works

1. **User registers or logs in.**
2. On login, they’re taken to the **menu page** where they can add pizzas to the cart.
3. Upon checkout, the **order is placed**, and a new record is saved in MongoDB.
4. **Socket.io** emits the new order event to the **admin dashboard** in real-time.
5. The **admin panel** lists all current orders. Admin can update the order status.
6. As status changes, **real-time events** update the user interface dynamically.
7. Both admin and user have access to **order history** and details.

---

## 🔐 Route Overview

| Method | Route                   | Description                     |
|--------|-------------------------|---------------------------------|
| GET    | `/`                     | Home/Login page                 |
| GET    | `/register`             | Registration page               |
| POST   | `/register`             | Handle new user registration    |
| POST   | `/login`                | Handle login                    |
| GET    | `/menu`                 | Pizza selection page (user)     |
| POST   | `/cart`                 | Add pizza to cart               |
| POST   | `/order`                | Place order                     |
| GET    | `/admin/orders`         | Admin dashboard                 |
| POST   | `/admin/order/status`   | Update order status             |
| GET    | `/logout`               | Logout and destroy session      |

---

## 🧠 Important Concepts Used

- **MVC Architecture**: Clean separation of logic (Models, Views, Controllers).
- **WebSockets (Socket.io)**: Used for real-time, bi-directional communication.
- **Session-Based Auth**: Maintains user/admin session across pages.
- **EJS + Tailwind**: Combines fast templating with modern UI styling.
- **MongoDB**: Handles users, orders, cart data with flexibility.

---

## 🧪 Testing & Tools

- **Postman**: For backend API testing
- **MongoDB Compass**: GUI to inspect database documents
- **Live Reloading**: Using `nodemon` for backend development
- **Tailwind Play CDN**: For rapid styling

---

## ✅ Completed

- User and Admin Authentication
- Real-Time Order Placement & Tracking
- Admin Dashboard with Live Order Updates
- Full UI using Tailwind + EJS
- Database Integration with MongoDB

---

## 🔧 What’s Remaining / Future Improvements

- 🔲 Add Email Notifications on Order Placed / Delivered
- 🔲 Add Search & Filter in Admin Dashboard
- 🔲 Add Order Tracking Page with Map (Optional)
- 🔲 Add Payment Gateway Integration (e.g., Razorpay, Stripe)
- 🔲 Migrate to React or Next.js frontend for SPA experience
- 🔲 Deploy on a production server (e.g., Render, Vercel, Railway)
- 🔲 Add Unit & Integration Testing (Jest / Mocha)

---

## 🙋‍♂️ Author

**Prince Bhatt**  
📧 [Email](Mailto:princebhatt316@gmail.com)  
🔗 [LinkedIn](https://linkedin.com/in/your-profile)  
📁 Portfolio: [GitHub](https://github.com/princebhatt03)

---

## 📜 License

This project is for educational/demo purposes and is open to contributions, suggestions, and forks!  
Feel free to build upon it and make it your own 🚀
