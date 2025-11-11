import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../services/api";


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Check if user is logged in on app load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          // Set axios default header for authenticated requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;


          // Set the user from localStorage
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log("Attempting login with:", { email });

      const response = await axios.post(getApiUrl("/api/auth/login"), {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.success) {
        // After successful login, fetch the complete user profile
        const token = response.data.token;
        localStorage.setItem("token", token);

        // Set axios default header for authenticated requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Fetch complete user profile for tutors to get profile image
        if (response.data.user.role === "tutor") {
          try {
            const profileResponse = await axios.get(
              getApiUrl("/api/tutors/my-profile"),
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );


            if (profileResponse.data.success) {
              // Merge the detailed profile with the user data
              const fullUserData = {
                ...response.data.user,
                profilePicture:
                  profileResponse.data.data.profilePicture || null,
              };

              // Store the complete user data
              localStorage.setItem("user", JSON.stringify(fullUserData));
              setCurrentUser(fullUserData);
            }
          } catch (profileError) {
            console.error("Error fetching profile details:", profileError);
            // Fall back to basic user data
            localStorage.setItem("user", JSON.stringify(response.data.user));

            setCurrentUser(response.data.user);
          }
        } else {
          // For non-tutors, just use the basic user data
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setCurrentUser(response.data.user);
        }

        // Navigate based on user role
        if (response.data.user.role === "tutor") {
          navigate("/tutor-dashboard");
        } else {
          navigate("/parent-dashboard");
        }

        return { success: true };
      }

      return {
        success: false,
        message: response.data.message || "Login failed. Please try again.",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Invalid credentials",
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post(
        getApiUrl("/api/auth/register"),
        userData
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Set axios default header for authenticated requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        setCurrentUser(response.data.user);

        // Navigate based on user role
        if (response.data.user.role === "tutor") {
          navigate("/tutor-profile-setup");
        } else {
          navigate("/parent-dashboard");
        }

        return { success: true };
      }

      return {
        success: false,
        message: response.data.message || "Registration failed",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
    navigate("/login");
  };

  // Update current user function
  const updateCurrentUser = (userData) => {
    // Update localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Update state
    setCurrentUser(userData);
  };


  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    updateCurrentUser,
  };


  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        loading,
        updateCurrentUser,

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

