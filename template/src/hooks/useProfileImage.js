import { useState, useEffect } from 'react';

export const useProfileImage = (imageUrl, userName) => {
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Process the image URL when it changes
    if (imageUrl && typeof imageUrl === 'string') {
      // Clean the URL (remove quotes, etc.)
      let processedUrl = imageUrl.trim();
      if (processedUrl.startsWith('"') && processedUrl.endsWith('"')) {
        processedUrl = processedUrl.substring(1, processedUrl.length - 1);
      }
      
      console.log('Processing image URL:', imageUrl, ' → ', processedUrl);
      setProcessedImageUrl(processedUrl);
      setImageError(false);
    } else {
      setProcessedImageUrl(null);
    }
  }, [imageUrl]);

  // Handle image errors
  const handleImageError = () => {
    console.log("Profile image failed to load:", processedImageUrl);
    setImageError(true);
    
    // Return a UI Avatars URL as fallback
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=6366F1&color=fff&size=128`;
  };

  // Return the fallback URL if there was an error or no image URL
  const displayUrl = imageError || !processedImageUrl
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=6366F1&color=fff&size=128`
    : processedImageUrl;

  return { 
    imageUrl: displayUrl, 
    handleImageError,
    isPlaceholder: imageError || !processedImageUrl
  };
};