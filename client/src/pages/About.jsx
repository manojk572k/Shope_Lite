import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-card">
        <h2>About This Project</h2>
        <p className="intro">
          This is a full-featured <strong>MERN stack e-commerce application</strong> designed to showcase real-world development practices, interactive features, and a scalable architecture. The project emphasizes user-centric design, security, and maintainability, simulating production-ready e-commerce platforms.
        </p>

        <section className="section">
          <h3>Core Features</h3>
          <ul>
            <li>
              <strong>Authentication & Security:</strong> Secure JWT-based login system with protected and public routes. Sensitive pages are accessible only to authorized users.
            </li>
            <li>
              <strong>Role-Based UI:</strong> Dynamic interface tailored for user roles (user/admin). Admin-only pages like dashboard are restricted.
            </li>
            <li>
              <strong>Interactive Navigation & Cart:</strong> Real-time cart badge, seamless navigation, and a responsive layout for smooth user experience.
            </li>
            <li>
              <strong>Search & Filters:</strong> Instant product search, advanced filtering options, and shared state across components.
            </li>
            <li>
              <strong>Protected Routes:</strong> Sensitive pages like checkout, profile, and admin dashboard enforce authentication and authorization checks.
            </li>
          </ul>
        </section>

        <section className="section">
          <h3>Page Overview</h3>
          <ul>
            <li>
              <strong>Shop Page:</strong> Browse products, utilize search and filter functionality, and navigate effortlessly.
            </li>
            <li>
              <strong>Cart Page:</strong> Add, remove, or update product quantities with live total updates.
            </li>
            <li>
              <strong>Checkout Page:</strong> Secure, protected route for order finalization and payment simulation.
            </li>
            <li>
              <strong>Profile Page:</strong> Personal dashboard with user account details, order history, and role-based actions.
            </li>
            <li>
              <strong>Admin Page:</strong> Exclusive access for admins to manage users, products, and site operations.
            </li>
            <li>
              <strong>Authentication Page:</strong> Login and registration forms with field validation, error handling, and smooth UX transitions.
            </li>
          </ul>
        </section>

        <section className="section">
          <h3>Technical Highlights</h3>
          <ul>
            <li>React with Context API for scalable global state management</li>
            <li>Protected and public route architecture for secure navigation</li>
            <li>Role-based conditional rendering for dynamic UI adjustments</li>
            <li>Reusable, modular, and component-driven code structure</li>
            <li>Responsive, modern design with clean UI aesthetics</li>
            <li>Interactive features like live cart, real-time search, and filters</li>
          </ul>
        </section>

        <p className="conclusion">
          This project serves as a demonstration of <strong>production-ready MERN stack development</strong>, incorporating real-time features, secure architecture, and a polished user experience. It reflects my ability to design scalable, interactive, and user-friendly web applications.
        </p>
      </div>
    </div>
  );
}
