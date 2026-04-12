import axios from "axios";
 
const api = axios.create({
  baseURL: "https://cloud-task-manager-api-94456-ceazdjf4chcyb9hz.polandcentral-01.azurewebsites.net/api",
});
 
export default api;