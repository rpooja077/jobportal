import React, { useEffect } from 'react'
import Navbar from '../components_lite/Navbar'

const AboutUsPage = () => {
  // Debug: Log when component mounts
  useEffect(() => {
    console.log('AboutUsPage component mounted - FRESH About page loaded');
  }, []);

  return (
    <div className="min-vh-100" style={{backgroundColor: '#ffffff'}}>
      <Navbar />
      
      {/* About Header */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">About JobPortal</h1>
          <p className="lead mb-0">Your trusted partner in career growth</p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="h1 fw-bold text-dark mb-4">Our Story</h2>
              <p className="lead text-muted mb-4">
                JobPortal was founded with a simple mission: to make job searching and hiring 
                easier, faster, and more effective for everyone.
              </p>
              <p className="text-muted mb-4">
                We believe that every professional deserves to find their perfect role, 
                and every company deserves to find their ideal candidate.
              </p>
              
              <div className="row text-center">
                <div className="col-4">
                  <div className="bg-primary bg-opacity-10 rounded p-3">
                    <h4 className="fw-bold text-primary mb-1">5+</h4>
                    <small className="text-muted">Years</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-success bg-opacity-10 rounded p-3">
                    <h4 className="fw-bold text-success mb-1">50+</h4>
                    <small className="text-muted">Team</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-info bg-opacity-10 rounded p-3">
                    <h4 className="fw-bold text-info mb-1">25+</h4>
                    <small className="text-muted">Cities</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="bg-light rounded p-4">
                <i className="bi bi-heart text-primary" style={{fontSize: '4rem'}}></i>
                <h5 className="mt-3 mb-2">Built with Love</h5>
                <p className="text-muted mb-0">
                  We care about every user and every connection we help create.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card h-100 border-0 shadow">
                <div className="card-body p-4 text-center">
                  <i className="bi bi-bullseye text-primary" style={{fontSize: '3rem'}}></i>
                  <h4 className="mt-3 mb-3">Our Mission</h4>
                  <p className="text-muted">
                    To bridge the gap between talented professionals and innovative companies, 
                    creating meaningful career opportunities.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card h-100 border-0 shadow">
                <div className="card-body p-4 text-center">
                  <i className="bi bi-eye text-success" style={{fontSize: '3rem'}}></i>
                  <h4 className="mt-3 mb-3">Our Vision</h4>
                  <p className="text-muted">
                    To become India's most trusted job portal, revolutionizing how people 
                    find careers and companies discover talent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center h1 fw-bold text-dark mb-5">What We Believe In</h2>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-heart text-primary fs-4"></i>
                </div>
                <h5 className="fw-bold">Integrity</h5>
                <p className="text-muted small">We operate with complete transparency and honesty.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-star text-success fs-4"></i>
                </div>
                <h5 className="fw-bold">Excellence</h5>
                <p className="text-muted small">We strive for excellence in everything we do.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-lightbulb text-info fs-4"></i>
                </div>
                <h5 className="fw-bold">Innovation</h5>
                <p className="text-muted small">We continuously innovate our solutions.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="text-center">
                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-heart text-warning fs-4"></i>
                </div>
                <h5 className="fw-bold">Trust</h5>
                <p className="text-muted small">Building lasting relationships based on trust.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center h1 fw-bold text-dark mb-5">Meet Our Team</h2>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow text-center">
                <div className="card-body p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" 
                       style={{width: '70px', height: '70px'}}>
                    <i className="bi bi-person text-primary fs-3"></i>
                  </div>
                  <h5 className="fw-bold">Pooja R</h5>
                  <p className="text-muted mb-2">Founder & CEO</p>
                  <p className="text-muted small">
                    Leading JobPortal with vision and passion.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow text-center">
                <div className="card-body p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" 
                       style={{width: '70px', height: '70px'}}>
                    <i className="bi bi-code-slash text-success fs-3"></i>
                  </div>
                  <h5 className="fw-bold">Tech Team</h5>
                  <p className="text-muted mb-2">Developers</p>
                  <p className="text-muted small">
                    Building innovative solutions.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow text-center">
                <div className="card-body p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" 
                       style={{width: '70px', height: '70px'}}>
                    <i className="bi bi-headset text-info fs-3"></i>
                  </div>
                  <h5 className="fw-bold">Support Team</h5>
                  <p className="text-muted mb-2">Customer Care</p>
                  <p className="text-muted small">
                    Always here to help you.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow text-center">
                <div className="card-body p-4">
                  <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" 
                       style={{width: '70px', height: '70px'}}>
                    <i className="bi bi-graph-up text-warning fs-3"></i>
                  </div>
                  <h5 className="fw-bold">Marketing Team</h5>
                  <p className="text-muted mb-2">Growth Experts</p>
                  <p className="text-muted small">
                    Expanding our reach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="h1 fw-bold text-dark mb-4">Get in Touch</h2>
              <p className="lead text-muted mb-5">
                Have questions? We'd love to hear from you.
              </p>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center">
                    <i className="bi bi-geo-alt text-primary fs-4 me-3"></i>
                    <div className="text-start">
                      <h6 className="fw-bold mb-1">Location</h6>
                      <small className="text-muted">Indore, MP, India</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center">
                    <i className="bi bi-envelope text-primary fs-4 me-3"></i>
                    <div className="text-start">
                      <h6 className="fw-bold mb-1">Email</h6>
                      <small className="text-muted">support@jobportal.local</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="text-start">
                      <h6 className="fw-bold mb-1">Phone</h6>
                      <small className="text-muted">+91 99999 99999</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h3 className="fw-bold mb-3">Ready to Get Started?</h3>
          <p className="mb-4">Join thousands of professionals who trust JobPortal</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <a href="/register" className="btn btn-light btn-lg">
              <i className="bi bi-person-plus me-2"></i>
              Create Account
            </a>
            <a href="/Browse" className="btn btn-outline-light btn-lg">
              <i className="bi bi-search me-2"></i>
              Browse Jobs
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUsPage
