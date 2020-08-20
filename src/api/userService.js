import axios from "axios";
import authHeader from "./authHeader";

const api = axios.create({
  // baseURL: `https://webhook.site/184211d4-bf10-40ee-bc5e-b6e14f68acf3`,
  // withCredentials: true,
  baseURL: `https://safe-plateau-95293.herokuapp.com`,
  headers:{
      // 'Access-Control-Allow-Origin': '*',
      // 'accept': 'application/json',
      // 'content-type': 'text/plain;charset=UTF-8',
      // 'sec-fetch-site': 'no-cors',
      'access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNTJlNzNmOC1jZDc0LTQ2MWQtOTZiYy1iM2Y1YmRlYWFiNDEiLCJpYXQiOjE1OTc3NTE5MjAsImV4cCI6MTU5ODM1NjcyMH0.tAP8EabYNCNlJNIB9LIGghJHbRX_uUZmlgHHjaPD07o'
  }
})

const API_URL = "";
// get ListEvent of user
const getEventList = async () => {
  try {
    let data = await api.get('/api/v1/event/list').then(({data}) => data.data)
    // console.log("data in getEventList: ", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Create New Event -> error
const createEvent = async (addEvent) => {
  console.log("Event: ",addEvent);
  let res = await api.post('/api/v1/event/create', addEvent)
      .catch(error => console.log(error))
  console.log("Res: ",res);
}

const deleteEvent = async (eventid) => {
  let res = await api.delete('/api/v1/event/delete', {
    data:{
      eventid: eventid}
  })
}

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};



export default {
  getEventList,
  createEvent,
  deleteEvent
};