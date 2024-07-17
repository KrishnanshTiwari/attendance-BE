import axios from "axios";

const baseurl = "";

export const postAttendance = (payload) => {
  axios
    .post(`${baseurl}/api/attendance`, payload)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

export const getAllAttendance = () => {
  axios
    .get(`${baseurl}/api/attendances`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

export const getUser = (payload) => {
  axios
    .post(`${baseurl}/auth`, payload)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};
