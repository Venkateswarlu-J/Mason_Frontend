import React from "react";
import "../styles/components.css";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1>About</h1>
      </div>

      <div className="about-container">
        <div className="about-hero">
          <h2 className="about-title">Construction Workforce Manager</h2>
          <p className="about-subtitle">
            A simple tool built to take the hassle out of managing daily labour on construction sites.
          </p>
        </div>

        <div className="about-section">
          <h3 className="about-section-title">What it does</h3>
          <p className="about-text">
            This platform lets site supervisors and contractors manage their entire
            workforce from one place. You can add workers, record daily attendance, and
            automatically calculate how much each worker is owed at the end of the week —
            all without touching a spreadsheet or paper register.
          </p>
        </div>

        <div className="about-section">
          <h3 className="about-section-title">Worker management</h3>
          <p className="about-text">
            Maintain a roster of workers across seven trade categories — Electricians,
            Mason Mestri, Mason Coolie, Wood Workers, Wood Mestri, Tiles Mestri, and
            Tiles Workers. Each worker has a profile with their name, phone number,
            category, and daily wage rate.
          </p>
        </div>

        <div className="about-section">
          <h3 className="about-section-title">Attendance tracking</h3>
          <p className="about-text">
            Mark each worker's attendance every day as Present, Absent, or Half Day.
            The system tracks how many days each worker has attended since Monday
            and keeps a running total through the week.
          </p>
        </div>

        <div className="about-section">
          <h3 className="about-section-title">Weekly payments</h3>
          <p className="about-text">
            At the end of the week, wages are calculated automatically based on each
            worker's daily rate and attendance. You can record whether payment was
            made in Cash or via UPI, keeping a clear and auditable payment history.
          </p>
        </div>

        <div className="about-section">
          <h3 className="about-section-title">Why it exists</h3>
          <p className="about-text">
            Manual bookkeeping on construction sites is error-prone and time-consuming.
            This tool removes that burden — reducing mistakes, saving time, and giving
            workers a fair and transparent record of their earnings.
          </p>
        </div>
      </div>
    </div>
  );
}