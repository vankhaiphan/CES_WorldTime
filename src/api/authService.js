import axios from "axios";

const API_URL_LOGIN =
  " https://safe-plateau-95293.herokuapp.com/api/v1/user/login/";
const API_URL_SIGNUP = " https://safe-plateau-95293.herokuapp.com/api/v1/user/create";
//need URL
//register Api
const signup = (firstname, lastname, email, password) => {
  return axios.post(API_URL_SIGNUP, {
    email,
    password,
    firstname,
    lastname,
  })
  .then((response) => {
      
    console.log(response);
    if (response.data.token) {
      {
        /*Save JWT in localStorage */
      }
      localStorage.setItem("email", email);
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  });
};

//Login Api
const login = (email, password) => {
  return axios
    .post(API_URL_LOGIN, {
      email,
      password,
    })
    .then((response) => {
      
      console.log(response);
      if (response.data.token) {
        {
          /*Save JWT in localStorage */
        }
        localStorage.setItem("email", email);
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

//Logout Api , remove user
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("email");
  
      window.location.reload();
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
