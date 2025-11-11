import { useState, useEffect } from "react";

// Generate avatar SVG data URL
const generateAvatarSVG = (name) => {
  const initials = (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect fill='%236366F1' width='128' height='128'/><text fill='%23fff' font-family='sans-serif' font-size='48' dy='10.5' font-weight='bold' x='50%' y='50%' text-anchor='middle'>${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};


export const useProfileImage = (imageUrl, userName) => {
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Process the image URL when it changes
    if (imageUrl && typeof imageUrl === "string") {

      // Clean the URL (remove quotes, etc.)
      let processedUrl = imageUrl.trim();
      if (processedUrl.startsWith('"') && processedUrl.endsWith('"')) {
        processedUrl = processedUrl.substring(1, processedUrl.length - 1);
      }

      // Filter out blob URLs (silently, as this is expected behavior)
      if (processedUrl.startsWith("blob:")) {
        setProcessedImageUrl(null);
      } else {
        setProcessedImageUrl(processedUrl);
        setImageError(false);
      }

    } else {
      setProcessedImageUrl(null);
    }
  }, [imageUrl]);

  // Handle image errors
  const handleImageError = () => {
    setImageError(true);

    // Return an inline SVG avatar as fallback
    return generateAvatarSVG(userName || "User");
  };

  // Return the fallback URL if there was an error or no image URL
  const displayUrl =
    imageError || !processedImageUrl
      ? generateAvatarSVG(userName || "User")
      : processedImageUrl;

  return {
    imageUrl: displayUrl,
    handleImageError,
    isPlaceholder: imageError || !processedImageUrl,
  };
};

