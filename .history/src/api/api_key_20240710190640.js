import axios from "./axios";

export const VerApis_Keys = async () => axios.get(`/api_key/`);

export const CrearApi_key = async (myApi_key) =>
  axios.post(`/api_key/crearApi_key/`, myApi_key);

export const actualizaApi_key = async (id, api_key) =>
  axios.put(`/api_key/editarApi_key/${id}`, api_key, console.log(api_key));
