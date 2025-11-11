import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get("token");
        const userString = searchParams.get("user");
        const error = searchParams.get("error");

        if (error) {
          console.error("OAuth error:", error);
          navigate("/login?error=Google authentication failed");
          return;
        }

        if (token && userString) {
          const user = JSON.parse(decodeURIComponent(userString));

          // Store token and user data
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          // Update auth context
          login(user, token);

          // Redirect based on role
          if (user.role === "tutor") {
            navigate("/tutor-dashboard");
          } else {
            navigate("/parent-dashboard");
          }
        } else {
          navigate("/login?error=Invalid authentication response");
        }
      } catch (error) {
        console.error("Callback handling error:", error);
        navigate("/login?error=Authentication failed");
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Completing authentication...
        </h2>
        <p className="text-gray-600">Please wait while we sign you in</p>
      </div>
    </div>
  );
};

export default AuthCallback;
