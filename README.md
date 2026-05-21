# Flower Shop Inventory Management System

A modern web application designed to automate inventory tracking and warehouse processes for a flower business. The project allows staff and management to easily manage the assortment while maintaining a completely transparent and secure history of all changes.

## Technology Stack

* **Frontend:** Vite, JavaScript (ES6+), HTML5, CSS3
* **Database & BaaS:** Firebase (Cloud Firestore, Authentication)
* **Architecture:** Modular JavaScript, Design Patterns (GoF)

## Key Features & Architectural Solutions

* ** Inventory Management:** Quick and convenient addition of new flower batches specifying name, size, and quantity.
* ** Proxy Pattern (Security & Audit):** Intercepts database requests to validate access and automatically enriches input data (adds timestamp, UID, user name, and role) to maintain a reliable audit trail without altering core business logic.
* ** Decorator Pattern (In-memory Cache):** Optimizes read operations. Repeated history fetches are served instantly from the browser's RAM, drastically reducing network load and cloud database costs.

## Live Demo
**[florist-3a3b3.web.app](https://florist-3a3b3.web.app)** — Live working version of the project.

---

## Local Setup
This project uses a private Firebase database. To run it locally, you will need to set up your own Firebase project.

1. `git clone https://github.com/Haina-me/CURSOVA.git`
2. `npm install`
3. Create the `src/config/firebase-config.js` file and insert your own Firebase access keys.
4. `npm run dev`

## Author

**Tetiana**
* GitHub: [@Haina-me](https://github.com/Haina-me)