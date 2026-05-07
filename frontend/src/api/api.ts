// frontend/src/api/api.ts
import axiosClient from "./axiosClient";

export const registerApi = (data: any) =>
  axiosClient.post("/api/auth/register", data);

export const loginApi = (data: any) =>
  axiosClient.post("/api/auth/login", data);

export const uploadDataset = (formData: FormData) =>
  axiosClient.post("/api/data/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getDatasets = () =>
  axiosClient.get("/api/data");

export const runAnalytics = (datasetId: string) =>
  axiosClient.post("/api/analytics/run", { datasetId });

export const getUsers = () =>
  axiosClient.get("/api/admin/users");

export const deleteUser = (id: string) =>
  axiosClient.delete(`/api/admin/user/${id}`);

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