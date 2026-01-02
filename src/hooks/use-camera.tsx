import { useState, useRef, useCallback, useEffect } from "react";

interface UseCameraOptions {
  facingMode?: "user" | "environment";
}

export const useCamera = (options: UseCameraOptions = {}) => {
  const { facingMode = "user" } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError(err instanceof Error ? err.message : "Failed to access camera");
      setIsActive(false);
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, []);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !isActive) return null;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    return imageData;
  }, [isActive]);

  const resetCapture = useCallback(() => {
    setCapturedImage(null);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isActive,
    error,
    capturedImage,
    startCamera,
    stopCamera,
    captureImage,
    resetCapture,
  };
};
