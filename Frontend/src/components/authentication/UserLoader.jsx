import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";

const UserLoader = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const loadUserData = async () => {
      // Only load if user is not already loaded
      if (!user) {
        try {
          console.log('🔄 Loading user data on app start...');
          const response = await axios.get(`${USER_API_ENDPOINT}/me`, {
            withCredentials: true,
          });

          if (response.data.success) {
            console.log('✅ User data loaded:', response.data.user);
            dispatch(setUser(response.data.user));
          } else {
            console.log('❌ Failed to load user data:', response.data.message);
          }
        } catch (error) {
          console.log('❌ Error loading user data:', error.response?.data?.message || error.message);
          // Don't show error toast for this, as user might not be logged in
        }
      }
    };

    loadUserData();
  }, [dispatch, user]);

  return children;
};

export default UserLoader;






