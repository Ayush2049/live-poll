import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const createPoll = (data) => API.post("/polls", data);

export const getPoll = (id) => API.get(`/polls/${id}`);

export const castVote = (pollId, optionId) =>
  API.post(`/votes/${pollId}`, { optionId });

export default API;
