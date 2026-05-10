
import React, { useState } from "react";
import Toast from "../components/common/Toast.jsx";
import useToast from "../hooks/useToast";
import "../styles/components.css";
import "./ContactPage.css";
import { sendMail } from "../api/contact.api.js";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const { toast, showToast, clearToast } = useToast();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // POST to your backend endpoint which emails venkateshjavvaji121@gmail.com
    //   const res = await fetch("/api/contact/send", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       ...form,
    //       to: "venkateshjavvaji121@gmail.com",
    //     }),
    //   });

    //   if (!res.ok) {
    //     const err = await res.text();
    //     throw new Error(err || "Failed to send");
    //   }
        await sendMail(form);

      showToast("Message sent successfully!", "success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      showToast(err.message || "Failed to send message. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-wrap">
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <div className="page-header">
        <h1>Contact</h1>
      </div>

      <div className="contact-layout">

        {/* ── Left: what to reach out about ── */}
        <div className="contact-left">
          <h2 className="contact-heading">Get in touch</h2>
          <p className="contact-intro">
            Have a question, found a bug, or want to suggest an improvement?
            Fill in the form and your message will be sent directly to us.
          </p>

          <div className="contact-reasons">
            <div className="contact-reason">
              <span className="contact-reason-icon">🐛</span>
              <div>
                <div className="contact-reason-title">Bug Reports</div>
                <div className="contact-reason-desc">
                  Something broken or behaving unexpectedly? Describe the issue and steps to reproduce it.
                </div>
              </div>
            </div>

            <div className="contact-reason">
              <span className="contact-reason-icon">💡</span>
              <div>
                <div className="contact-reason-title">Feature Requests</div>
                <div className="contact-reason-desc">
                  Have an idea that would make your workflow easier? We'd love to hear it.
                </div>
              </div>
            </div>

            <div className="contact-reason">
              <span className="contact-reason-icon">❓</span>
              <div>
                <div className="contact-reason-title">General Questions</div>
                <div className="contact-reason-desc">
                  Unsure how something works or need help getting started? Reach out anytime.
                </div>
              </div>
            </div>

            <div className="contact-reason">
              <span className="contact-reason-icon">📊</span>
              <div>
                <div className="contact-reason-title">Data Issues</div>
                <div className="contact-reason-desc">
                  Attendance or payment records looking wrong? Flag it and we'll investigate.
                </div>
              </div>
            </div>
          </div>

          <div className="contact-email-row">
            <span className="contact-email-label">Or email directly</span>
            <a href="mailto:venkateshjavvaji121@gmail.com" className="contact-email-link">
              venkateshjavvaji121@gmail.com
            </a>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div className="contact-right">
          <div className="contact-form-card">
            <div className="contact-form-header">Send a message</div>

            <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Your name *</label>
                  <input
                    className="form-input"
                    name="name"
                    placeholder="Suresh Kumar"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Your email *</label>
                  <input
                    className="form-input"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">Subject *</label>
                <input
                  className="form-input"
                  name="subject"
                  placeholder="e.g. Bug in attendance page"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-input"
                  name="message"
                  rows={6}
                  placeholder="Describe your feedback, bug, or question in detail…"
                  value={form.message}
                  onChange={handleChange}
                  required
                  style={{ resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary contact-submit"
                disabled={sending}
              >
                {sending ? "Sending…" : "Send message"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}