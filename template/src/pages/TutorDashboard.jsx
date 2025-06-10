import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaChevronRight, FaPaperPlane, FaTimes } from 'react-icons/fa';

const TutorDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    earnings: 0
  });
  
  // Messaging states
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  
  useEffect(() => {
    const fetchTutorProfile = async () => {
      if (currentUser && currentUser.role === 'tutor') {
        try {
          setLoading(true);
          const token = localStorage.getItem('token');
          
          // Log the token being used (only first few characters for security)
          console.log('Using token:', token ? `${token.substring(0, 10)}...` : 'No token found');
          
          const response = await axios.get(`http://localhost:5001/api/tutors/my-profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('Profile API response:', response.data);
          
          if (response.data.success) {
            console.log('Fetched profile:', response.data.data);
            const profileData = response.data.data;
            
            // Format classes if it's a string
            if (typeof profileData.classes === 'string') {
              profileData.classes = profileData.classes.split(',').map(c => c.trim());
            }
            
            // Ensure subjects is an array
            if (!Array.isArray(profileData.subjects)) {
              profileData.subjects = profileData.subjects ? [profileData.subjects] : [];
            }
            
            // Ensure availableTimeSlots is an array
            if (!Array.isArray(profileData.availableTimeSlots)) {
              profileData.availableTimeSlots = profileData.availableTimeSlots ? 
                [profileData.availableTimeSlots] : [];
            }
            
            setProfile(profileData);
          } else {
            console.error('API returned success:false', response.data);
          }
          
          // For demonstration purposes, set some sample stats
          setStats({
            totalStudents: Math.floor(Math.random() * 10) + 1,
            totalSessions: Math.floor(Math.random() * 20) + 5,
            upcomingSessions: Math.floor(Math.random() * 5),
            earnings: (Math.floor(Math.random() * 500) + 100).toFixed(2)
          });
        } catch (error) {
          console.error('Error fetching tutor profile:', error);
          console.error('Response data:', error.response?.data);
          console.error('Status code:', error.response?.status);
          
          // Check for authentication errors
          if (error.response?.status === 401) {
            alert('Your session has expired. Please log in again.');
            logout(); // Log the user out if token is invalid
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchTutorProfile();
  }, [currentUser, logout]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) return;
      
      try {
        setLoadingMessages(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No token found');
          setLoadingMessages(false);
          return;
        }
        
        console.log('Fetching conversations...');
        
        const response = await axios.get('http://localhost:5001/api/messages/conversations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Conversations response:', response.data);
        
        if (response.data.success) {
          // Transform the data structure to match our UI needs
          const conversations = response.data.data.map(conv => ({
            id: conv.id,
            parentId: conv.otherUser.id,
            parentName: conv.otherUser.name,
            parentAvatar: conv.otherUser.profilePicture || "https://via.placeholder.com/60x60?text=User",
            unreadCount: conv.unreadCount,
            lastMessage: conv.lastMessage,
            timestamp: new Date(conv.timestamp),
            messages: [] // Messages will be loaded when conversation is selected
          }));
          
          // Filter only for conversations with parents (if needed)
          const parentConversations = conversations.filter(
            conv => conv.otherUser?.role === 'parent'
          );
          
          setMessages(conversations);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [currentUser]);
  
  // Handle sending a reply
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;
    
    // Get the recipient ID from the conversation
    const recipientId = selectedConversation.parentId;
    
    try {
      setSendingReply(true);
      const token = localStorage.getItem('token');
      
      // Optimistically add the message to UI
      const tempId = `temp_${Date.now()}`;
      const tempMessage = {
        id: tempId,
        senderId: currentUser.id,
        text: replyText,
        timestamp: new Date(),
        read: false,
        pending: true // Mark as pending until confirmed by server
      };
      
      // Update the conversation in our state
      setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, tempMessage],
        lastMessage: replyText,
        timestamp: new Date()
      }));
      
      // Clear the reply text
      setReplyText('');
      
      // Send to server
      const response = await axios.post(
        'http://localhost:5001/api/messages',
        {
          recipientId,
          text: replyText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Replace the temp message with the confirmed one
        const confirmedMessage = {
          id: response.data.data._id,
          senderId: response.data.data.sender,
          recipientId: response.data.data.recipient,
          text: response.data.data.text,
          timestamp: new Date(response.data.data.createdAt),
          read: response.data.data.read
        };
        
        // Update in the selected conversation
        setSelectedConversation(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.id === tempId ? confirmedMessage : msg
          ),
          lastMessage: confirmedMessage.text,
          timestamp: confirmedMessage.timestamp
        }));
        
        // Update in the main messages list
        setMessages(prevMessages => 
          prevMessages.map(convo => {
            if (convo.id === selectedConversation.id) {
              return {
                ...convo,
                lastMessage: confirmedMessage.text,
                timestamp: confirmedMessage.timestamp
              };
            }
            return convo;
          })
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark the message as failed
      setSelectedConversation(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === `temp_${Date.now()}` ? { ...msg, failed: true } : msg
        )
      }));
      
      // Show error message
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingReply(false);
    }
  };
  
  // Format date/time for messages
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Mark messages as read when conversation is selected
  const handleSelectConversation = async (conversation) => {
    try {
      // First update UI state
      setSelectedConversation({
        ...conversation,
        messages: conversation.messages.length ? conversation.messages : [{
          id: 'loading',
          senderId: null,
          text: 'Loading messages...',
          timestamp: new Date(),
          read: true
        }]
      });
      
      const token = localStorage.getItem('token');
      
      // Fetch messages for this conversation
      const response = await axios.get(
        `http://localhost:5001/api/messages/conversations/${conversation.id}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        // Format messages for our UI
        const loadedMessages = response.data.data.map(msg => ({
          id: msg._id,
          senderId: msg.sender,
          recipientId: msg.recipient,
          text: msg.text,
          timestamp: new Date(msg.createdAt),
          read: msg.read
        }));
        
        // Update the conversation in our state
        setSelectedConversation(prev => ({
          ...prev,
          messages: loadedMessages,
          unreadCount: 0 // Messages should be marked as read by backend
        }));
        
        // Also update in our messages list
        setMessages(prevMessages => 
          prevMessages.map(convo => {
            if (convo.id === conversation.id) {
              return {
                ...convo,
                unreadCount: 0,
                messages: loadedMessages
              };
            }
            return convo;
          })
        );
      }
    } catch (error) {
      console.error('Error loading conversation messages:', error);
      // Show error in conversation
      setSelectedConversation(prev => ({
        ...prev,
        messages: [{
          id: 'error',
          senderId: null,
          text: 'Failed to load messages. Please try again.',
          timestamp: new Date(),
          read: true
        }]
      }));
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="animate-pulse text-indigo-600 font-medium">
          <svg className="w-12 h-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  const defaultProfilePic = "https://via.placeholder.com/150?text=Tutor";
  const profilePic = profile?.profilePicture || currentUser?.profilePicture || defaultProfilePic;
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tutor Dashboard</h1>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link 
              to="/edit-tutor-profile"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </Link>
            <button 
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <img 
                    src={profilePic} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">{currentUser?.name || "Tutor Name"}</h2>
                <p className="text-gray-500">{currentUser?.email || "email@example.com"}</p>
                
                <div className="mt-3 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                  Active Tutor
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Profile Details</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span className="text-gray-600">{currentUser?.email || "email@example.com"}</span>
                  </div>
                  
                  {/* Show qualifications */}
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Qualifications</span>
                      <p className="text-gray-600">{profile?.qualifications || "Not specified"}</p>
                    </div>
                  </div>
                  
                  {/* Show subjects with tags */}
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Subjects</span>
                      <div className="flex flex-wrap mt-1">
                        {profile?.subjects && Array.isArray(profile.subjects) && profile.subjects.length > 0 ? (
                          profile.subjects.map((subject, idx) => (
                            <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full mr-1.5 mb-1.5">
                              {subject}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-600">No subjects specified</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Show classes/grades with tags */}
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Classes/Grades</span>
                      <div className="flex flex-wrap mt-1">
                        {profile?.classes ? (
                          typeof profile.classes === 'string' ? (
                            profile.classes.split(',').map((cls, idx) => (
                              <span key={idx} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full mr-1.5 mb-1.5">
                                {cls.trim()}
                              </span>
                            ))
                          ) : Array.isArray(profile.classes) ? (
                            profile.classes.map((cls, idx) => (
                              <span key={idx} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full mr-1.5 mb-1.5">
                                {cls}
                              </span>
                            ))
                          ) : (
                            <p className="text-gray-600">No classes specified</p>
                          )
                        ) : (
                          <p className="text-gray-600">No classes specified</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Show phone number */}
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Phone</span>
                      <p className="text-gray-600">{profile?.phoneNumber || "Not specified"}</p>
                    </div>
                  </div>
                  
                  {/* Show WhatsApp number */}
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                      <p className="text-gray-600">
                        {profile?.whatsappNumber ? (
                          <a 
                            href={`https://wa.me/${profile.whatsappNumber.replace(/\D/g, '')}`} 
                            className="text-green-600 hover:text-green-800"
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {profile.whatsappNumber}
                          </a>
                        ) : (
                          "Not specified"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Students</p>
                    <p className="text-xl font-bold text-gray-800">{stats.totalStudents}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Total Sessions</p>
                    <p className="text-xl font-bold text-gray-800">{stats.totalSessions}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Upcoming</p>
                    <p className="text-xl font-bold text-gray-800">{stats.upcomingSessions}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Earnings</p>
                    <p className="text-xl font-bold text-gray-800">${stats.earnings}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Messages Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-indigo-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Messages from Parents</h3>
              </div>
              
              <div className="flex h-[500px]">
                {/* Conversations List */}
                <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                  {loadingMessages ? (
                    <div className="py-8 flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">No messages yet</p>
                    </div>
                  ) : (
                    <div>
                      {messages.map((conversation) => (
                        <div 
                          key={conversation.id}
                          className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition duration-150 flex items-center ${
                            selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''
                          }`}
                          onClick={() => handleSelectConversation(conversation)}
                        >
                          <div className="relative flex-shrink-0">
                            <img 
                              src={conversation.parentAvatar} 
                              alt={conversation.parentName}
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                            {conversation.unreadCount > 0 && (
                              <span className="absolute top-0 right-0 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                              </span>
                            )}
                          </div>
                          <div className="ml-3 overflow-hidden flex-1">
                            <div className="flex justify-between items-baseline">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {conversation.parentName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatMessageTime(conversation.timestamp)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 truncate">
                              {conversation.lastMessage}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <div className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Message View */}
                <div className="w-2/3 flex flex-col">
                  {selectedConversation ? (
                    <>
                      {/* Conversation Header */}
                      <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center">
                          <img 
                            src={selectedConversation.parentAvatar} 
                            alt={selectedConversation.parentName}
                            className="w-9 h-9 rounded-full object-cover mr-2"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{selectedConversation.parentName}</p>
                          </div>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => setSelectedConversation(null)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                      
                      {/* Messages */}
                      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        <div className="space-y-4">
                          {selectedConversation.messages.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-gray-500">No messages in this conversation yet</p>
                            </div>
                          ) : (
                            selectedConversation.messages.map((message) => (
                              <div 
                                key={message.id} 
                                className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                              >
                                <div 
                                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                    message.senderId === currentUser.id 
                                      ? `bg-indigo-600 text-white ${message.failed ? 'opacity-70' : ''}` 
                                      : 'bg-white border border-gray-200 text-gray-800'
                                  }`}
                                >
                                  {message.pending && (
                                    <div className="mb-1 flex items-center justify-end">
                                      <span className="w-3 h-3 mr-1 inline-block animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                      <span className="text-xs text-indigo-200">Sending...</span>
                                    </div>
                                  )}
                                  {message.failed && (
                                    <div className="mb-1 flex items-center justify-end">
                                      <span className="text-xs text-red-200">Failed to send</span>
                                    </div>
                                  )}
                                  <p className="text-sm">{message.text}</p>
                                  <p 
                                    className={`text-xs mt-1 ${
                                      message.senderId === currentUser.id 
                                        ? 'text-indigo-200' 
                                        : 'text-gray-400'
                                    }`}
                                  >
                                    {formatMessageTime(message.timestamp)}
                                    {message.senderId === currentUser.id && !message.pending && !message.failed && (
                                      <span className="ml-2">
                                        {message.read ? '• Read' : '• Sent'}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                      
                      {/* Reply Input */}
                      <div className="p-3 bg-white border-t border-gray-200">
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSendReply();
                          }}
                          className="flex items-center"
                        >
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          <button
                            type="submit"
                            disabled={!replyText.trim() || sendingReply}
                            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md transition duration-200 ${
                              !replyText.trim() || sendingReply ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {sendingReply ? (
                              <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                            ) : (
                              <FaPaperPlane />
                            )}
                          </button>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                      <svg className="w-16 h-16 text-gray-300 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <p className="text-gray-500 text-center">
                        Select a conversation to view messages
                      </p>
                      <p className="text-gray-400 text-sm text-center mt-2 max-w-md">
                        You can communicate with parents and respond to inquiries about tutoring services
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Teaching Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Teaching Overview</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Time Slots */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Available Time Slots</h4>
                  <div className="max-h-48 overflow-y-auto">
                    {profile?.availableTimeSlots && Array.isArray(profile.availableTimeSlots) && profile.availableTimeSlots.length > 0 ? (
                      <ul className="space-y-2">
                        {profile.availableTimeSlots.map((slot, idx) => (
                          <li key={idx} className="text-sm bg-gray-50 px-3 py-2 rounded flex items-center">
                            <svg className="w-4 h-4 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {slot}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No time slots set</p>
                        <Link to="/edit-tutor-profile" className="mt-2 inline-block text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                          Set your availability
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Activity</h4>
                  <div className="max-h-48 overflow-y-auto">
                    <div className="text-center py-8">
                      <svg className="w-10 h-10 text-gray-300 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p className="mt-2 text-gray-500">No recent activity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex flex-col items-center transition duration-200">
                  <svg className="w-6 h-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Manage Schedule</span>
                </button>
                
                <button className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center transition duration-200">
                  <svg className="w-6 h-6 text-green-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-sm text-gray-600">Create Class</span>
                </button>
                
                <button className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex flex-col items-center transition duration-200">
                  <svg className="w-6 h-6 text-purple-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">My Students</span>
                </button>
                
                <button className="bg-red-50 hover:bg-red-100 p-4 rounded-lg flex flex-col items-center transition duration-200">
                  <svg className="w-6 h-6 text-red-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Messages</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;