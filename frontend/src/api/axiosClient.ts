import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000", // backend URL
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;

export const downloadCsvReport = async (datasetId: string) => {
  const res = await axiosClient.get("/api/report/csv", {
    params: { datasetId },
    responseType: "blob",
  });

  const blob = new Blob([res.data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `risk_report_${datasetId}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
};