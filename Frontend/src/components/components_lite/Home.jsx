/**
 * Home Component
 * 
 * The main landing page of the application.
 * 
 * Features:
 * - Redirects recruiters to admin/companies
 * - Displays header, categories, about section, and latest jobs
 * - Handles 401 errors silently
 * - Responsive layout for all screen sizes
 * 
 * @returns {JSX.Element} The rendered Home component
 */

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Header from "./Header";
import Categories from "./Categories";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // Fetch all jobs and manage loading state
  const { loading, error } = useGetAllJobs();
  const jobs = useSelector((state) => state.jobs.allJobs);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  /**
   * Redirect recruiters to admin/companies
   * Runs when user.role changes
   */
  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/admin/companies");
    }
  }, [user?.role, navigate]);

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      
      {/* Hero Section with search functionality */}
      <Header />
      
      {/* Categories Section - Browse jobs by category */}
      <section className="py-5 bg-white" aria-label="Job categories">
        <div className="container">
          <Categories />
        </div>
      </section>
      
      {/* About Section - Company information and stats */}
      <section className="py-5 bg-light" aria-label="About us">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold text-dark mb-4">
                About <span className="text-primary">JobPortal</span>
              </h2>
              <p className="lead text-muted mb-4">
                India's leading job portal connecting talented professionals with amazing opportunities. 
                We're dedicated to making job hunting and recruitment seamless, efficient, and successful for everyone.
              </p>
              <div className="row text-center mb-4">
                <div className="col-4">
                  <div className="bg-primary bg-opacity-10 rounded p-3">
                    <h3 className="fw-bold text-primary mb-1">1000+</h3>
                    <small className="text-muted">Jobs Posted</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-success bg-opacity-10 rounded p-3">
                    <h3 className="fw-bold text-success mb-1">500+</h3>
                    <small className="text-muted">Companies</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-info bg-opacity-10 rounded p-3">
                    <h3 className="fw-bold text-info mb-1">2000+</h3>
                    <small className="text-muted">Job Seekers</small>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-3">
                <a href="/creator" className="btn btn-primary btn-lg">
                  <i className="bi bi-info-circle me-2"></i>
                  Learn More
                </a>
                <a href="/register" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Get Started
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="bg-white rounded-3 p-5 shadow-sm">
                <i className="bi bi-building text-primary" style={{fontSize: '6rem'}}></i>
                <h4 className="fw-bold text-dark mt-3 mb-2">Your Career Partner</h4>
                <p className="text-muted mb-0">
                  Advanced job matching, company insights, and career growth tools 
                  to help you succeed in your professional journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Latest Jobs Section - Displays recent job postings */}
      <section className="py-5 bg-white" aria-label="Latest job postings">
        <div className="container">
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading jobs...</p>
            </div>
          )}
          {/* Suppress visible error on public home; silently show empty state */}
          {!loading && <LatestJobs jobs={jobs} />}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
