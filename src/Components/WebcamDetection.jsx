import React, { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Modal from "react-modal";
import "./Webcam.css";
import { useNavigate } from "react-router-dom";
import { postAttendance } from "../Constant/services";

const WebcamDetection = () => {
  const webcamRef = useRef(null);
  const [boundingBox, setBoundingBox] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [dropdownState, setDropdownState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadModels = async () => {
      //if (!localStorage.getItem("token")) navigate("/");
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector"),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri("/models/face_landmark_68_tiny"),
        ]);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, [navigate]);

  const handleVideo = useCallback(async () => {
    const video = webcamRef.current.video;
    if (video.readyState === 4) {
      try {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
          inputSize: 160,
          scoreThreshold: 0.5,
        }));
        setBoundingBox(detections.map((d) => d.box));
        if (detections.length > 0) {
          captureImage(detections[0].box);
        }
      } catch (error) {
        console.error("Error detecting faces:", error);
      }
    }
  }, []);

  const captureImage = useCallback((box) => {
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
  }, []);

  useEffect(() => {
    if (capturedImage) {
      setInProgress(true);
      postAttendance({ imgsrc: capturedImage }).then((res) => {
        setAttendance(res);
        if (res.results?.eid) {
          // Save token in local storage
          const token = {
            time: new Date().toLocaleString(),
            latitude: null,
            longitude: null,
          };
          navigator.geolocation.getCurrentPosition((position) => {
            token.latitude = position.coords.latitude;
            token.longitude = position.coords.longitude;
            localStorage.setItem(res.results.eid, JSON.stringify(token));
            alert("Attendance Marked");
            navigate("/user"); // Navigate to the root URL
          });
        }
      }).catch((error) => {
        console.error("Error posting attendance:", error);
      }).finally(() => {
        setInProgress(false);
        setCapturedImage(null);
      });
    }
  }, [capturedImage, navigate]);

  useEffect(() => {
    if (boundingBox.length === 0) {
      const interval = setInterval(handleVideo, 100);
      return () => clearInterval(interval);
    }
  }, [boundingBox, handleVideo]);

  const handleDropdown = (route) => {
    setDropdownState(false);
    if (route) navigate(route);
    else {
      if (window.confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("site-id");
        //navigate("/");
      }
    }
  };
  console.log("web cam intiated")
  return (
    <>
      <div className="header">
        <span className="back-btn">Face-Attendance</span>
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
        {boundingBox.map((box, index) => (
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
      <Modal
        isOpen={inProgress}
        contentLabel="Captured Image"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="card1">
          {capturedImage ? (
            <>
              <img className="img" src={capturedImage} alt="Captured face" />
              {attendance ? (
                <div className="msg">
                  <p className="message" style={{ color: attendance?.color }}>
                    {attendance?.message}
                  </p>
                </div>
              ) : (
                <div className="button-group">
                  <p className="message">Loading....</p>
                </div>
              )}
            </>
          ) : (
            <p className="message" style={{ marginBottom: "25px" }}>
              "Look into the camera to mark your attendance automatically with face recognition."
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default WebcamDetection;
