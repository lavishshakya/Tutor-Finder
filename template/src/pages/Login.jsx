import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { email, password, remember } = formData;
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Login attempt with:', { email });
      
      // Direct axios call for debugging
      try {
        const response = await axios.post('http://localhost:5001/api/auth/login', {
          email,
          password
        });
        
        console.log('Raw login response:', response.data);
        
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Set axios default header for authenticated requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
          // Navigate based on user role
          if (response.data.user.role === 'tutor') {
            window.location.href = '/tutor-dashboard';
          } else {
            window.location.href = '/parent-dashboard';
          }
        } else {
          setError(response.data.message || 'Login failed. Please try again.');
        }
      } catch (axiosError) {
        console.error('Direct axios error:', axiosError);
        setError(axiosError.response?.data?.message || 'Login request failed. Please try again.');
      }
      
      // Original login method through AuthContext
      // const result = await login(email, password);
      // if (!result.success) {
      //   setError(result.message);
      // }
    } catch (err) {
      console.error('Login submission error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 bg-white justify-center items-center p-12">
        <div className="max-w-xl">
          <img 
            src="/src/assets/1.jpg"
            alt="Login illustration" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      
      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold text-gray-800 mb-3">Sign In</h1>
            <p className="text-gray-500">
              Welcome back! Please sign in to your account
            </p>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0"
                required
              />
            </div>
            
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={remember}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              
              <div>
                <Link to="/forgot-password" className="text-sm text-indigo-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Log In'}
            </button>
          </form>
          
          <p className="text-center mt-8 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-500 hover:text-indigo-600 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;