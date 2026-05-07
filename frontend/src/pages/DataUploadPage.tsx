import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Typography,
  Card,
  Box,
} from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import { uploadDataset, getDatasets } from "../api/api";

export default function DataUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [datasets, setDatasets] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");
  const [isUploading, setIsUploading] = useState(false);

  const load = async () => {
    const res = await getDatasets();
    setDatasets(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    try {
      if (!file || !name.trim()) {
        setMsgType("error");
        setMsg("Please enter a dataset name and select a CSV file.");
        return;
      }

      if (!file.name.toLowerCase().endsWith(".csv")) {
        setMsgType("error");
        setMsg("Only CSV files are supported.");
        return;
      }

      setIsUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", name.trim());

      await uploadDataset(fd);

      setMsgType("success");
      setMsg("Uploaded successfully.");
      setName("");
      setFile(null);
      await load();
    } catch (err: any) {
      setMsgType("error");
      setMsg(err?.response?.data?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Upload Dataset
      </Typography>

      {msg && (
        <Alert severity={msgType} sx={{ mb: 2 }}>
          {msg}
        </Alert>
      )}

      <Card sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            label="Dataset Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ minWidth: 260 }}
          />

          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <Button variant="contained" onClick={upload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </Box>

        {file && (
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Selected file: {file.name}
          </Typography>
        )}
      </Card>

      <Card sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Uploaded Datasets
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Rows</TableCell>
              <TableCell>Columns</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datasets.map((d) => (
              <TableRow key={d._id}>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.rowCount ?? d.data?.length ?? 0}</TableCell>
                <TableCell>{Array.isArray(d.columns) ? d.columns.join(", ") : "-"}</TableCell>
                <TableCell>
                  {d.createdAt ? new Date(d.createdAt).toLocaleString() : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </MainLayout>
  );
}