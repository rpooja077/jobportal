import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      // Store the current location they were trying to access
      localStorage.setItem('redirectAfterLogin', location.pathname);
      // Show a message to the user
      toast.error('Please log in to access this page');
    }
  }, [user, location]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
