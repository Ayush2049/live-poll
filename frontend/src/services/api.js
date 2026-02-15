import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


export const createPoll = (data) => API.post("/polls", data);

export const getPoll = (id) => API.get(`/polls/${id}`);

export const castVote = (pollId, optionId, deviceToken) =>
  API.post(`/votes/${pollId}`, {
    optionId,
    deviceToken,
  });

export default API;
