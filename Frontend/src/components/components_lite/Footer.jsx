

/**
 * Footer Component
 * 
 * The main footer component that appears at the bottom of all pages.
 * Provides important links, contact information, and copyright notice.
 * 
 * Features:
 * - Responsive design with different layouts for mobile and desktop
 * - Quick links to main sections of the site
 * - Contact information and business hours
 * - Mobile bottom navigation for easy access
 * - Copyright and legal links
 * 
 * Sections:
 * 1. Company Info - Branding and tagline
 * 2. Quick Links - Navigation shortcuts
 * 3. For Job Seekers - Resources for applicants
 * 4. Contact - Business contact information
 * 5. Bottom Bar - Copyright and legal links
 * 6. Mobile Navigation - Sticky bottom bar on mobile
 */

import React from "react";
import { Link } from "react-router-dom";

/**
 * Main Footer component
 * Renders the footer with all its sections and responsive behavior
 */
const Footer = () => {
  return (
    /**
     * Main Footer Element
     * - Uses a gradient background for visual appeal
     * - Includes subtle border for depth
     * - Responsive padding for different screen sizes
     */
    <footer
      className="text-white mt-5"
      style={{
        background: "linear-gradient(180deg, #0b1220 0%, #0f172a 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "12px",
        paddingBottom: "8px",
      }}
      role="contentinfo"
      aria-label="Website footer"
    >
      <div className="container" style={{ maxWidth: "840px" }}>
        <div className="row g-4 align-items-start">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="mb-3">
              <h6 className="fw-bold mb-1" style={{letterSpacing: ".3px"}}>
                <span className="text-primary">Job</span>
                <span className="text-success">Portal</span>
              </h6>
              <p className="mb-1" style={{color: "#cbd5e1", fontSize: "0.9rem"}}>
                Connecting talented professionals with amazing opportunities. 
                Your gateway to the perfect career.
              </p>
              {/* Social icons removed to reduce height */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-sm-6">
            <h6 className="fw-bold mb-1" style={{color: "#e2e8f0"}}>Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-1">
                <Link to="/Home" className="text-decoration-none" style={{color: "#94a3b8"}}>
                  <i className="bi bi-chevron-right me-2"></i>Home
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/Browse" className="text-decoration-none" style={{color: "#94a3b8"}}>
                  <i className="bi bi-chevron-right me-2"></i>Browse Jobs
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/Jobs" className="text-decoration-none" style={{color: "#94a3b8"}}>
                  <i className="bi bi-chevron-right me-2"></i>All Jobs
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/creator" className="text-decoration-none" style={{color: "#94a3b8"}}>
                  <i className="bi bi-chevron-right me-2"></i>About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <h6 className="fw-bold mb-1" style={{color: "#e2e8f0"}}>For Job Seekers</h6>
            <ul className="list-unstyled">
              <li className="mb-1">
                <a href="#" className="text-decoration-none" style={{color: "#94a3b8"}}>
                  <i className="bi bi-chevron-right me-2"></i>Create Profile
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="text-decoration-none" style={{color: "#94a3b8"}}>
                  <i className="bi bi-chevron-right me-2"></i>Upload Resume
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="text-decoration-none" style={{color: "#94a3b8"}}>
                  <i className="bi bi-chevron-right me-2"></i>Job Alerts
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="text-decoration-none" style={{color: "#94a3b8"}}>
                  <i className="bi bi-chevron-right me-2"></i>Career Advice
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers removed to shorten footer */}

          {/* Contact */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <h6 className="fw-bold mb-1" style={{color: "#e2e8f0"}}>Contact</h6>
            <ul className="list-unstyled mb-0" style={{color: "#94a3b8"}}>
              <li className="mb-1"><i className="bi bi-geo-alt me-2"></i>Indore, MP, India</li>
              <li className="mb-1"><i className="bi bi-envelope me-2"></i>support@jobportal.local</li>
              <li className="mb-1"><i className="bi bi-telephone me-2"></i>+91 99999 99999</li>
              <li className="mb-1"><i className="bi bi-clock me-2"></i>Mon - Sat: 9:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Trusted by logos */}
        {/* Trusted by logos removed to reduce height */}

        {/* Bottom Footer with Copyright and Legal Links */}
        <hr className="my-2" style={{borderColor: "rgba(148,163,184,0.2)"}} />
        <div className="row align-items-center" role="contentinfo">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0" style={{color: "#94a3b8", fontSize: "0.95rem"}}>
              © 2025 <span className="fw-bold">JobPortal</span>. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 flex-wrap">
              <Link to="/PrivacyPolicy" className="text-decoration-none" style={{color: "#94a3b8", fontSize: "0.95rem"}}>
                Privacy Policy
              </Link>
              <span className="d-none d-md-inline" style={{color: "#64748b"}}>|</span>
              <Link to="/TermsofService" className="text-decoration-none" style={{color: "#94a3b8", fontSize: "0.95rem"}}>
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="text-center mt-3">
          <small style={{color: "#94a3b8", fontSize: "0.9rem"}}>
            Powered by{" "}
            <a 
              href="https://github.com/poojaR" 
              className="text-decoration-none fw-semibold"
              style={{color: "#60a5fa"}}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pooja R
            </a>
          </small>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Only visible on mobile devices */}
      <div className="d-lg-none d-md-none d-sm-block" role="navigation" aria-label="Mobile navigation">
        <div className="py-1" style={{background: "#0b1220", borderTop: "1px solid rgba(255,255,255,0.08)", fontSize: "0.9rem"}}>
          <div className="container">
            <div className="row text-center">
              <div className="col-4">
                <Link to="/Home" className="text-decoration-none d-block" style={{color: "#94a3b8"}}>
                  <i className="bi bi-house" style={{fontSize: "1rem"}}></i>
                  <small className="d-block">Home</small>
                </Link>
              </div>
              <div className="col-4">
                <Link to="/Browse" className="text-decoration-none d-block" style={{color: "#94a3b8"}}>
                  <i className="bi bi-search" style={{fontSize: "1rem"}}></i>
                  <small className="d-block">Browse</small>
                </Link>
              </div>
              <div className="col-4">
                <Link to="/Jobs" className="text-decoration-none d-block" style={{color: "#94a3b8"}}>
                  <i className="bi bi-briefcase" style={{fontSize: "1rem"}}></i>
                  <small className="d-block">Jobs</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


