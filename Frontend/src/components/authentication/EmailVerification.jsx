import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_ENDPOINT } from '@/utils/data';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${USER_API_ENDPOINT}/verify-email`, {
        email,
        otp: otpString
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setResendLoading(true);
    try {
      const response = await axios.post(`${USER_API_ENDPOINT}/resend-otp`, {
        email
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setCountdown(60); // 60 seconds cooldown
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(message);
    } finally {
      setResendLoading(false);
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
                    <i className="bi bi-envelope-check text-primary fs-2"></i>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Email Verification</h2>
                  <p className="text-muted mb-0">Enter the 6-digit code sent to your email</p>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark">
                    <i className="bi bi-envelope me-2 text-primary"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!searchParams.get('email')}
                  />
                </div>

                {/* OTP Input */}
                <form onSubmit={handleVerifyOTP}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-shield-lock me-2 text-primary"></i>
                      Verification Code
                    </label>
                    <div className="d-flex gap-2 justify-content-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          className="form-control form-control-lg text-center"
                          style={{ width: '50px', height: '60px' }}
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onFocus={(e) => e.target.select()}
                        />
                      ))}
                    </div>
                    <small className="text-muted d-block text-center mt-2">
                      Enter the 6-digit code from your email
                    </small>
                  </div>

                  {/* Verify Button */}
                  <div className="d-grid mb-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading || otp.join('').length !== 6}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Verify Email
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Resend OTP */}
                <div className="text-center">
                  <p className="text-muted mb-2">Didn't receive the code?</p>
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={handleResendOTP}
                    disabled={resendLoading || countdown > 0}
                  >
                    {resendLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending...
                      </>
                    ) : countdown > 0 ? (
                      `Resend in ${countdown}s`
                    ) : (
                      <>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Resend Code
                      </>
                    )}
                  </button>
                </div>

                {/* Back to Login */}
                <div className="text-center mt-4">
                  <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => navigate('/login')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
