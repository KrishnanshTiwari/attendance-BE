import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const WebcamDetection = () => {
  const webcamRef = useRef(null);
  const [boundingBox, setBoundingBox] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detected, setDetected] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector"),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models/face_landmark_68_tiny"),
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  const handleVideo = async () => {
    if (isLoading) return;
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      try {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 }));
        setBoundingBox(detections.map(d => d.box));
        setDetected(detections.length > 0);
        setFacesDetected(detections.length);
        if (detections.length > 0) captureImage(detections[0].box);
      } catch (error) {
        console.error('Error detecting faces:', error);
      }
    }
  };

  const captureImage = (box) => {
    const video = webcamRef.current.video;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = box.width;
    canvas.height = box.height;
    context.drawImage(video, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);
    const faceImage = canvas.toDataURL('image/jpeg');
    setCapturedImage(faceImage);
  };

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        handleVideo();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <>

      <div style={{ width: '100vw', height: '100%', overflow: 'hidden' }}>
        <Webcam
          ref={webcamRef}
          forceScreenshotSourceSize
          videoContainerStyle={{
            position: 'relative',
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
          }}
          // videoStyle={{
          //   transform: 'scale(0.2)',
          //   transformOrigin: 'center',
          //   width: '100%', 
          //   height: 'auto', 
          // }}
        />
        {boundingBox.map((box, index) => (
          <div
            key={index}
            style={{
              border: '4px solid red',
              position: 'absolute',
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
      {capturedImage && <img src={capturedImage} alt="Captured face" />}
    </>
  );
};

export default WebcamDetection;

