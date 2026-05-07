import {
  Card,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../api/api";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await registerApi(form);
      navigate("/login");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #06132a 0%, #081a3a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
          background: "rgba(20, 30, 48, 0.85)",
          border: "1px solid rgba(148, 163, 184, 0.15)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#ffffff", fontWeight: 700 }}
        >
          Create Account
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "rgba(255,255,255,0.72)", mb: 2 }}
        >
          Register to access financial analytics and dashboard features.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          InputLabelProps={{ style: { color: "#cbd5e1" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              backgroundColor: "#2f6ea1",
            },
          }}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          InputLabelProps={{ style: { color: "#cbd5e1" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              backgroundColor: "#2f6ea1",
            },
          }}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          InputLabelProps={{ style: { color: "#cbd5e1" } }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              backgroundColor: "#2f6ea1",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  sx={{ color: "#fff" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={submit}
          disabled={loading}
          sx={{
            mt: 2,
            py: 1.3,
            backgroundColor: "#1d9bf0",
            textTransform: "uppercase",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#1683ca",
            },
          }}
        >
          {loading ? "Registering..." : "Register"}
        </Button>

        <Stack spacing={1} sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.72)", textAlign: "center" }}
          >
            Already have an account?{" "}
            <Box
              component={Link}
              to="/login"
              sx={{
                color: "#7dd3fc",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Login
            </Box>
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.72)", textAlign: "center" }}
          >
            <Box
              component={Link}
              to="/"
              sx={{
                color: "#7dd3fc",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Back to Home
            </Box>
          </Typography>
        </Stack>
      </Card>
    </Box>
  );
}