import axios from "axios";

const API_URL = "http://localhost:5001/api"; // Backend server manzili

export const getAdmins = async () => {
  const response = await axios.get(`${API_URL}/admins`);
  return response.data.admins;
};

export const getSubjects = async () => {
  const response = await axios.get(`${API_URL}/subjects`);
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await axios.post(`${API_URL}/subjects`, subjectData);
  return response.data;
};

export const updateSubject = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/subjects/${id}`, updatedData);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await axios.delete(`${API_URL}/subjects/${id}`);
  return response.data;
};
