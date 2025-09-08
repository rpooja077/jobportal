import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('Login attempt with data:', input);

    try {
      const response = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        withCredentials: true,
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
        
        // Redirect based on role
        if (response.data.user.role === "Recruiter") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      const message = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
      
      // Handle email verification error
      if (error.response?.data?.emailNotVerified) {
        navigate(`/verify-email?email=${input.email}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                    <i className="bi bi-person-circle text-primary fs-2"></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Welcome Back!</h2>
                  <p className="text-muted mb-0">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <form onSubmit={submitHandler}>
                  {/* Email */}
                  <div className="mb-3">
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
                      autoComplete="email"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
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
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-3">
                      <i className="bi bi-person-badge me-2 text-primary"></i>
                      Select Your Role
                    </label>
                    <div className="row g-3">
                      <div className="col-6">
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
                      <div className="col-6">
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

                  {/* Submit Button */}
                  <div className="d-grid mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Signing In...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="text-center mb-4">
                  <span className="text-muted">Don't have an account?</span>
                </div>

                {/* Register Link */}
                <div className="d-grid">
                  <Link
                    to="/register"
                    className="btn btn-outline-primary btn-lg"
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </Link>
                </div>

                {/* Email Verification Notice */}
                <div className="mt-4 p-3 bg-info bg-opacity-10 border border-info border-opacity-25 rounded">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-info-circle text-info me-2 mt-1"></i>
                    <div>
                      <small className="text-info fw-medium">Email Verification Required</small>
                      <p className="text-muted small mb-0 mt-1">
                        New users must verify their email address before logging in. Check your inbox for the verification code.
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

export default Login;
