import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import "./Webcam.css";
import { useNavigate } from "react-router-dom";

const WebcamDetection = () => {
  const webcamRef = useRef(null);
  const [boundingBox, setBoundingBox] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [detected, setDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceRecognized, setFaceRecognized] = useState(false);
  const lastAttend = "Ashish Godiyal";

  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      if (!localStorage.getItem("token")) navigate("/");
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(
            "/models/tiny_face_detector"
          ),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(
            "/models/face_landmark_68_tiny"
          ),
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  const handleVideo = useCallback(async () => {
    if (isLoading || detected || capturedImage !== null) return;

    const video = webcamRef.current.video;
    if (video.readyState === 4) {
      try {
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
            scoreThreshold: 0.5,
          })
        );
        setBoundingBox(detections.map((d) => d.box));

        if (detections.length > 0) {
          captureImage(detections[0].box);
          setFaceRecognized(true);
          setDetected(true);

          setTimeout(() => {
            setFaceRecognized(false);
            setDetected(false);
            setCapturedImage(null);
          }, 5000);
        }
      } catch (error) {
        console.error("Error detecting faces:", error);
      }
    }
  }, [isLoading, detected, capturedImage]);

  const captureImage = (box) => {
    const video = webcamRef.current.video;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = box.width;
    canvas.height = box.height;

    context.drawImage(
      video,
      box.x,
      box.y,
      box.width,
      box.height,
      0,
      0,
      box.width,
      box.height
    );
    const faceImage = canvas.toDataURL("image/jpeg");
    setCapturedImage(faceImage);
  };

  useEffect(() => {
    if (!isLoading && !detected) {
      const interval = setInterval(handleVideo, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading, detected, handleVideo]);

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("site-id");
      navigate("/");
    }
  };

  return (
    <>
      <div className="header">
        <span className="back-btn">BAC भारत</span>
        <button className="logout-btn" onClick={logout}>
          Logout <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          forceScreenshotSourceSize
          videoContainerStyle={{
            position: "relative",
            width: "100vw",
            height: "100%",
            overflow: "hidden",
          }}
        />
        {capturedImage == null &&
          boundingBox.map((box, index) => (
            <div
              key={index}
              style={{
                border: "4px solid #001f3f",
                position: "absolute",
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
                pointerEvents: "none",
              }}
            />
          ))}
      </div>
      <div className="info">
        {detected
          ? `"${lastAttend} your attendance was successfully marked"`
          : `"Look into the camera to mark your attendance automatically with face recognition."`}
      </div>
      <span className="fix-btn" onClick={() => navigate("/attendances")}>
        <i className="fa-solid fa-list"></i>
      </span>
      {capturedImage && <img src={capturedImage} alt="Captured face" />}
    </>
  );
};

export default WebcamDetection;
