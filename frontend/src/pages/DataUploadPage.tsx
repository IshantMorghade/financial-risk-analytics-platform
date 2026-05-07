import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import DatasetRoundedIcon from "@mui/icons-material/DatasetRounded";
import TableChartRoundedIcon from "@mui/icons-material/TableChartRounded";
import { alpha, useTheme } from "@mui/material/styles";
import { uploadDataset, getDatasets } from "../api/api";

type DatasetRecord = {
  _id: string;
  name: string;
  rowCount?: number;
  columns?: string[];
  data?: any[];
  createdAt?: string;
};

export default function DataUploadPage() {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [datasets, setDatasets] = useState<DatasetRecord[]>([]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error" | "info">("info");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    try {
      setIsLoading(true);
      const res = await getDatasets();
      setDatasets(Array.isArray(res?.data) ? res.data : []);
    } catch (err: any) {
      setMsgType("error");
      setMsg(err?.response?.data?.message || "Failed to load datasets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleUpload = async () => {
    try {
      setMsg("");

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
      setMsg("Dataset uploaded successfully.");
      setName("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await load();
    } catch (err: any) {
      setMsgType("error");
      setMsg(err?.response?.data?.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const totalRows = datasets.reduce(
    (sum, dataset) => sum + (dataset.rowCount ?? dataset.data?.length ?? 0),
    0
  );

  return (
    <Stack spacing={3}>
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(17,24,39,0.96) 100%)",
          boxShadow: "0 20px 40px rgba(2, 6, 23, 0.28)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#f8fafc" }}>
            Data Upload Center
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.75 }}>
            Upload CSV datasets to power portfolio analytics, benchmarking, and risk monitoring.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
            <Card
              sx={{
                flex: 1,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <DatasetRoundedIcon sx={{ color: "#60a5fa" }} />
                  <Typography sx={{ color: "#cbd5e1", fontWeight: 700 }}>
                    Total Datasets
                  </Typography>
                </Stack>
                <Typography sx={{ mt: 1.5, color: "#fff", fontSize: 28, fontWeight: 800 }}>
                  {datasets.length}
                </Typography>
              </CardContent>
            </Card>

            <Card
              sx={{
                flex: 1,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <TableChartRoundedIcon sx={{ color: "#22c55e" }} />
                  <Typography sx={{ color: "#cbd5e1", fontWeight: 700 }}>
                    Total Rows
                  </Typography>
                </Stack>
                <Typography sx={{ mt: 1.5, color: "#fff", fontSize: 28, fontWeight: 800 }}>
                  {totalRows}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      {msg && (
        <Alert severity={msgType} sx={{ borderRadius: 3 }}>
          {msg}
        </Alert>
      )}

      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid rgba(148,163,184,0.14)",
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.95) 100%)",
          boxShadow: "0 14px 32px rgba(2, 6, 23, 0.20)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
            Upload New Dataset
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5, mb: 3 }}>
            Provide a dataset name and upload a CSV file with historical portfolio or market data.
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              label="Dataset Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: NIFTY Portfolio Jan 2024"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.03)",
                },
              }}
            />

            <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            aria-label="Upload CSV dataset file"
            className="hidden-file-input"
          />

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <Button
                variant="outlined"
                startIcon={<InsertDriveFileRoundedIcon />}
                onClick={handleChooseFile}
                sx={{ alignSelf: { xs: "stretch", md: "flex-start" } }}
              >
                Choose CSV File
              </Button>

              <Box
                sx={{
                  flex: 1,
                  minHeight: 48,
                  px: 2,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 3,
                  border: "1px dashed rgba(148,163,184,0.24)",
                  bgcolor: "rgba(255,255,255,0.02)",
                  color: file ? "#e2e8f0" : "#94a3b8",
                }}
              >
                {file ? `Selected file: ${file.name}` : "No file selected"}
              </Box>

              <Button
                variant="contained"
                startIcon={<CloudUploadRoundedIcon />}
                onClick={handleUpload}
                disabled={isUploading}
                sx={{ minWidth: 160 }}
              >
                {isUploading ? "Uploading..." : "Upload Dataset"}
              </Button>
            </Stack>

            <Typography variant="caption" sx={{ color: "#94a3b8" }}>
              Supported format: CSV only. Make sure the file contains headers in the first row.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: 4,
          border: "1px solid rgba(148,163,184,0.14)",
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.95) 100%)",
          boxShadow: "0 14px 32px rgba(2, 6, 23, 0.20)",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2.25, borderBottom: "1px solid rgba(148,163,184,0.12)" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
              Uploaded Datasets
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
              Review uploaded datasets and verify their size and structure.
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : datasets.length === 0 ? (
            <Box sx={{ px: 3, py: 6 }}>
              <Typography sx={{ color: "#94a3b8" }}>
                No datasets uploaded yet.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: "transparent" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#94a3b8", borderColor: "rgba(148,163,184,0.12)" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "#94a3b8", borderColor: "rgba(148,163,184,0.12)" }}>
                      Rows
                    </TableCell>
                    <TableCell sx={{ color: "#94a3b8", borderColor: "rgba(148,163,184,0.12)" }}>
                      Columns
                    </TableCell>
                    <TableCell sx={{ color: "#94a3b8", borderColor: "rgba(148,163,184,0.12)" }}>
                      Created
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {datasets.map((dataset) => (
                    <TableRow key={dataset._id} hover>
                      <TableCell sx={{ color: "#e2e8f0", borderColor: "rgba(148,163,184,0.08)" }}>
                        {dataset.name}
                      </TableCell>

                      <TableCell sx={{ color: "#cbd5e1", borderColor: "rgba(148,163,184,0.08)" }}>
                        {dataset.rowCount ?? dataset.data?.length ?? 0}
                      </TableCell>

                      <TableCell sx={{ borderColor: "rgba(148,163,184,0.08)" }}>
                        {Array.isArray(dataset.columns) && dataset.columns.length > 0 ? (
                          <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                            {dataset.columns.slice(0, 4).map((col) => (
                              <Chip
                                key={col}
                                label={col}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(96,165,250,0.12)",
                                  color: "#93c5fd",
                                  border: "1px solid rgba(255,255,255,0.08)",
                                }}
                              />
                            ))}
                            {dataset.columns.length > 4 && (
                              <Chip
                                label={`+${dataset.columns.length - 4} more`}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(255,255,255,0.05)",
                                  color: "#cbd5e1",
                                }}
                              />
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                            -
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell sx={{ color: "#cbd5e1", borderColor: "rgba(148,163,184,0.08)" }}>
                        {dataset.createdAt
                          ? new Date(dataset.createdAt).toLocaleString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}