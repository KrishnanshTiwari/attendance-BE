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
  const [detected, setDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [dropdownState, setDropdownState] = useState(false);
  const [timer, setTimer] = useState(3000);
  const [lastAttendance, setLastAttendance] = useState("is not updated");
  const [markingAttendance, setMarkingAttendance] = useState(false);

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
        setDetected(false);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    loadModels();
  }, [navigate]);

  const handleVideo = useCallback(async () => {
    if (capturedImage != null || markingAttendance) {
      console.log(
        "return from handleVideo",
        capturedImage.toString().length,
        markingAttendance
      );
      return;
    }
    const video = webcamRef.current.video;
    if (video.readyState === 4 && !markingAttendance) {
      try {
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 160,
            scoreThreshold: 0.5,
          })
        );
        setBoundingBox(detections.map((d) => d.box));
        if (detections.length > 0 && !detected) {
          captureImage(detections[0].box);
        }
      } catch (error) {
        console.error("Error detecting faces:", error);
      }
    }
  }, [detected, markingAttendance]);

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}.${minutes}`;
  };

  const markAttendance = useCallback(
    async (imgsrc) => {
      const time = getCurrentTime();
      try {
        const res = await postAttendance({ imgsrc, time, lastAttendance });
        setAttendance(res);
        setInProgress(true);
        if (res?.results?.eid) {
          setLastAttendance(res.results.eid);
        }
        if (res.sameEmployee) {
          setTimer(5000);
          setDetected(true);
        } else {
          setTimeout(() => {
            setDetected(false);
            setAttendance(null);
            setInProgress(false);
            setCapturedImage(null);
          }, 5000);
        }
      } catch (error) {
        console.error("Error marking attendance:", error);
        setAttendance(null);
      }
      setMarkingAttendance(false);
    },
    [lastAttendance]
  );

  const captureImage = useCallback(
    (box) => {
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
    },
    [markAttendance]
  );

  useEffect(() => {
    if (capturedImage) {
      setMarkingAttendance(true);
      markAttendance(capturedImage);
    }
  }, [capturedImage]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1000);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setInProgress(false);
      setDetected(false);
      setTimer(0);
      setAttendance(null);
      setCapturedImage(null);
    }
  }, [timer]);

  useEffect(() => {
    if (!detected) {
      const interval = setInterval(handleVideo, 100);
      return () => clearInterval(interval);
    }
  }, [detected, handleVideo]);

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("site-id");
      navigate("/");
    }
  };

  const handleDropdown = (route) => {
    setDropdownState(false);
    if (route) navigate(route);
    else logout();
  };

  return (
    <>
      <div className="header">
        <span className="back-btn">BAC भारत</span>
        <div className={`dropdown`}>
          <button
            onClick={() => setDropdownState(!dropdownState)}
            className="dropdown-btn"
          >
            <i className="fa-solid fa-list"></i>
          </button>
          <div
            className={`dropdown-items ${
              dropdownState ? "isVisible" : "isHidden"
            }`}
          >
            <div
              className="dropdown-item"
              onClick={() => handleDropdown("/attendances")}
            >
              <div className="dropdown__link">
                <i className="fa-solid fa-list"></i> Attendance list
              </div>
            </div>
            <div className="dropdown-item">
              <div
                className="dropdown__link"
                onClick={() => handleDropdown(false)}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </div>
            </div>
          </div>
        </div>
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
      <Modal
        isOpen={true}
        contentLabel="Captured Image"
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        {inProgress ? (
          <div className="card1">
            <img className="img" src={capturedImage} alt="Captured face" />
            {attendance ? (
              <div className="msg">
                <p className="message" style={{ color: attendance?.color }}>
                  {attendance?.message}{" "}
                  {attendance?.sameEmployee && timer / 1000}
                </p>
              </div>
            ) : (
              <div className="button-group">
                <p className="message">Loading....</p>
              </div>
            )}
          </div>
        ) : (
          <p className="message" style={{ marginBottom: "25px" }}>
            "Look into the camera to mark your attendance automatically with
            face recognition."
          </p>
        )}
      </Modal>
    </>
  );
};

export default WebcamDetection;
