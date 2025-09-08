import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    adharcard: "",
    pancard: "",
    role: "Student",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const ChangeFilehandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setProfilePhoto(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Name validation
    const nameRegex = /^[a-zA-Z\s]+$/;
    const trimmedName = input.fullname.trim();
    
    if (!trimmedName) {
      toast.error("Full name is required");
      setLoading(false);
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("Full name must be at least 2 characters long");
      setLoading(false);
      return;
    }

    if (!nameRegex.test(trimmedName)) {
      toast.error("Full name can only contain letters and spaces");
      setLoading(false);
      return;
    }

    if (/^\s+$/.test(input.fullname)) {
      toast.error("Full name cannot be only spaces");
      setLoading(false);
      return;
    }

    if (/^\d+$/.test(trimmedName)) {
      toast.error("Full name cannot be only numbers");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email.trim())) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Phone validation
    const phoneRegex = /^[6-9][0-9]{9}$/;
    if (!phoneRegex.test(input.phoneNumber.trim())) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      setLoading(false);
      return;
    }

    // Password validation
    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (input.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(input.pancard.trim().toUpperCase())) {
      toast.error("Please enter a valid PAN card number (e.g., ABCDE1234F)");
      setLoading(false);
      return;
    }

    // Aadhaar validation
    const aadhaarRegex = /^[0-9]{12}$/;
    if (!aadhaarRegex.test(input.adharcard.trim())) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      setLoading(false);
      return;
    }

    if (!profilePhoto) {
      toast.error("Please select a profile photo");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("password", input.password);
      formData.append("adharcard", input.adharcard);
      formData.append("pancard", input.pancard);
      formData.append("role", input.role);
      formData.append("profilePhoto", profilePhoto);

      const response = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        
        // Navigate to email verification page
        navigate(`/verify-email?email=${input.email}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                    <i className="bi bi-person-plus text-success fs-2"></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Create Account</h2>
                  <p className="text-muted mb-0">Join Job Portal and start your journey</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={submitHandler}>
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-person me-2 text-primary"></i>
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        value={input.fullname}
                        onChange={changeEventHandler}
                        className="form-control form-control-lg"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-envelope me-2 text-primary"></i>
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="form-control form-control-lg"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-telephone me-2 text-primary"></i>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={input.phoneNumber}
                        onChange={changeEventHandler}
                        className="form-control form-control-lg"
                        placeholder="Enter 10-digit number"
                        pattern="[6-9][0-9]{9}"
                        required
                      />
                      <small className="text-muted">10-digit Indian mobile number</small>
                    </div>

                    {/* Password */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-lock me-2 text-primary"></i>
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="form-control form-control-lg"
                        placeholder="Enter password"
                        minLength="6"
                        required
                      />
                      <small className="text-muted">Minimum 6 characters</small>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-lock-fill me-2 text-primary"></i>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={input.confirmPassword}
                        onChange={changeEventHandler}
                        className="form-control form-control-lg"
                        placeholder="Confirm password"
                        required
                      />
                    </div>

                    {/* PAN Card */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-card-text me-2 text-primary"></i>
                        PAN Card Number
                      </label>
                      <input
                        type="text"
                        name="pancard"
                        value={input.pancard}
                        onChange={changeEventHandler}
                        className="form-control form-control-lg"
                        placeholder="Enter 10-character PAN"
                        required
                      />
                      <small className="text-muted">Enter your 10-character PAN card number</small>
                    </div>

                    {/* Aadhaar Card */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-card-text me-2 text-primary"></i>
                        Aadhaar Card Number
                      </label>
                      <input
                        type="text"
                        name="adharcard"
                        value={input.adharcard}
                        onChange={changeEventHandler}
                        className="form-control form-control-lg"
                        placeholder="123456789012"
                        pattern="[0-9]{12}"
                        required
                      />
                      <small className="text-muted">12-digit Aadhaar number</small>
                    </div>

                    {/* Role Selection */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark mb-3">
                        <i className="bi bi-person-badge me-2 text-primary"></i>
                        Select Your Role
                      </label>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="form-check border rounded p-3 h-100">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="role"
                              value="Student"
                              checked={input.role === "Student"}
                              onChange={changeEventHandler}
                              id="studentRole"
                              required
                            />
                            <label className="form-check-label fw-medium" htmlFor="studentRole">
                              <i className="bi bi-mortarboard me-2 text-success"></i>
                              Student
                            </label>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-check border rounded p-3 h-100">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="role"
                              value="Recruiter"
                              checked={input.role === "Recruiter"}
                              onChange={changeEventHandler}
                              id="recruiterRole"
                              required
                            />
                            <label className="form-check-label fw-medium" htmlFor="recruiterRole">
                              <i className="bi bi-building me-2 text-info"></i>
                              Recruiter
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Photo */}
                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-camera me-2 text-primary"></i>
                        Profile Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={ChangeFilehandler}
                        className="form-control form-control-lg"
                        required
                      />
                      <small className="text-muted">Upload a professional photo (JPG, PNG, max 5MB)</small>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mt-4 mb-3">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="text-center mb-3">
                  <span className="text-muted">Already have an account?</span>
                </div>

                {/* Login Link */}
                <div className="d-grid">
                  <Link
                    to="/login"
                    className="btn btn-outline-primary btn-lg"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Link>
                </div>

                {/* Email Verification Notice */}
                <div className="mt-4 p-3 bg-info bg-opacity-10 border border-info border-opacity-25 rounded">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-info-circle text-info me-2 mt-1"></i>
                    <div>
                      <small className="text-info fw-medium">Email Verification Required</small>
                      <p className="text-muted small mb-0 mt-1">
                        After registration, you'll receive a verification code via email. You must verify your email before logging in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
