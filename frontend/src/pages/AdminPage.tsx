import { useEffect, useState } from "react";
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
  Typography,
  Paper,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { alpha, useTheme } from "@mui/material/styles";
import { getUsers, deleteUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

type UserRecord = {
  _id: string;
  email: string;
  role?: string;
  createdAt?: string;
};

export default function AdminPage() {
  const { role } = useAuth();
  const theme = useTheme();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getUsers();
      setUsers(Array.isArray(res?.data) ? res.data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      loadUsers();
    }
  }, [role]);

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      setDeletingId(userId);
      setError("");
      setSuccess("");
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      setSuccess("User deleted successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingId("");
    }
  };

  if (role !== "admin") {
    return (
      <Box>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Access denied. Admin privileges are required to view this page.
        </Alert>
      </Box>
    );
  }

  const adminCount = users.filter((user) => user.role === "admin").length;
  const normalUserCount = users.length - adminCount;

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
            Admin Console
          </Typography>
          <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.75 }}>
            Manage registered users and review platform access roles.
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
                  <GroupRoundedIcon sx={{ color: "#60a5fa" }} />
                  <Typography sx={{ color: "#cbd5e1", fontWeight: 700 }}>
                    Total Users
                  </Typography>
                </Stack>
                <Typography sx={{ mt: 1.5, color: "#fff", fontSize: 28, fontWeight: 800 }}>
                  {users.length}
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
                  <ShieldRoundedIcon sx={{ color: "#22c55e" }} />
                  <Typography sx={{ color: "#cbd5e1", fontWeight: 700 }}>
                    Admin Users
                  </Typography>
                </Stack>
                <Typography sx={{ mt: 1.5, color: "#fff", fontSize: 28, fontWeight: 800 }}>
                  {adminCount}
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                  Standard users: {normalUserCount}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ borderRadius: 3 }}>
          {success}
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
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2.25, borderBottom: "1px solid rgba(148,163,184,0.12)" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#f8fafc" }}>
              User Management
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
              Review registered accounts and remove users when necessary.
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{ px: 3, py: 6 }}>
              <Typography sx={{ color: "#94a3b8" }}>No users found.</Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: "transparent" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#94a3b8", borderColor: "rgba(148,163,184,0.12)" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ color: "#94a3b8", borderColor: "rgba(148,163,184,0.12)" }}>
                      Role
                    </TableCell>
                    <TableCell sx={{ color: "#94a3b8", borderColor: "rgba(148,163,184,0.12)" }}>
                      Status
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: "#94a3b8", borderColor: "rgba(148,163,184,0.12)" }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell sx={{ color: "#e2e8f0", borderColor: "rgba(148,163,184,0.08)" }}>
                        {user.email}
                      </TableCell>

                      <TableCell sx={{ borderColor: "rgba(148,163,184,0.08)" }}>
                        <Chip
                          label={user.role || "user"}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor:
                              user.role === "admin"
                                ? "rgba(34,197,94,0.14)"
                                : "rgba(96,165,250,0.14)",
                            color: user.role === "admin" ? "#4ade80" : "#60a5fa",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ borderColor: "rgba(148,163,184,0.08)" }}>
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: "rgba(16,185,129,0.14)",
                            color: "#34d399",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        />
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{ borderColor: "rgba(148,163,184,0.08)" }}
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteOutlineRoundedIcon />}
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id}
                        >
                          {deletingId === user._id ? "Deleting..." : "Delete"}
                        </Button>
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