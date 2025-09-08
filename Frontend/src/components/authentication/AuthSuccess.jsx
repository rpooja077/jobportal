import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "@/utils/data.js";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Check if user is authenticated by making a request to get user data
        const response = await axios.get(`${USER_API_ENDPOINT}/me`, {
          withCredentials: true,
        });

        if (response.data.success) {
          dispatch(setUser(response.data.user));
          toast.success("Successfully logged in with Google!");
          navigate("/");
        } else {
          toast.error("Authentication failed");
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth success error:", error);
        toast.error("Authentication failed");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleAuthSuccess();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Completing authentication...</h5>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthSuccess;
