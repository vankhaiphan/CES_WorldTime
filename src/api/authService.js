import axios from 'axios';

const API_URL = "";//need URL
//register Api
const signup = (firstName, lastName, email, password) => {
  return axios.post(API_URL + "signup", {
    firstName, 
    lastName,
    email,
    password,
  });
};

//Login Api
const login = (email, password) => {
  return axios
    .post(API_URL + "signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
         {/*Save JWT in localStorage */}
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

//Logout Api , remove user 
const logout = () => {
  localStorage.removeItem("user");
};

//get stored user information (including JWT)
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  signup,
  login,
  logout,
  getCurrentUser,
};