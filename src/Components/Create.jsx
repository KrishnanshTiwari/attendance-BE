import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadData } from "../Constant/services"; // Adjust the import path as needed
import "./Create.css";

const Create = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    motherName: "",
    fatherName: "",
    gender: "",
    address: "",
    mobileNumber: "",
    dob: "",
    sportsName: "",
    password: "",
    image: null,
  });

  const [imageName, setImageName] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
    setImageName(e.target.files[0].name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    try {
      const response = await uploadData(data);
      console.log(response);
      alert("Data uploaded successfully!");
      navigate("/"); // Navigate to the home page after successful upload
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Failed to upload data.");
    }
  };

  return (
    <div className="create-container">
      <h2>Upload Player Data</h2>
      <form onSubmit={handleSubmit} className="create-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="motherName"
          placeholder="Mother's Name"
          value={formData.motherName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          value={formData.fatherName}
          onChange={handleChange}
          required
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sportsName"
          placeholder="Sports Name"
          value={formData.sportsName}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="file-upload">
          <label htmlFor="fileInput" className="custom-button">
            Upload Image
          </label>
          <input
            type="file"
            id="fileInput"
            name="image"
            className="custom-file-input"
            onChange={handleFileChange}
            required
          />
          {imageName && <p>Selected file: {imageName}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Create;
