import axios from "axios";

const baseurl = "https://attendance-app-be-nwma.onrender.com";
//const baseurl = "http://localhost:8000";

export const postAttendance = async (payload) => {
  try {
    const response = await axios.post(`${baseurl}/api/add-attendance`, payload);
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error posting attendance:", error);
    throw error;
  }
};

export const getAttendances = async (selectedDate) => {
  try {
    const response = await axios.post(`${baseurl}/api/get-attendances`, {
      selectedDate,
    });
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching attendances:", error);
    throw error;
  }
};

export const authUser = async (payload) => {
  try {
    const response = await axios.post(`${baseurl}/api/auth`, payload);
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return error;
  }
};

export const getAllSites = async () => {
  try {
    const response = await axios.get(`${baseurl}/api/get-sites`);
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return error;
  }
};

export const uploadData = async (payload) => {
  try {
    const response = await axios.post(`${baseurl}/api/upload_data`, payload);
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error uploading data:", error);
    throw error;
  }
};

export const getUser = async (eid) => {
  try {
    const response = await axios.get(`${baseurl}/api/get-user`, { params: { eid } });
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const getUserDetails = async (eid) => {
  try {
    const response = await axios.get(`${baseurl}/api/get-user`, {
      params: { eid }
    });
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await axios.post(`${baseurl}/api/login`, payload);
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
