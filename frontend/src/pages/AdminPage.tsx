import { useEffect, useState } from "react";
import { Table, TableRow, TableCell, Button } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import { getUsers, deleteUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { role } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (role === "admin") {
      getUsers().then(res => setUsers(res.data));
    }
  }, [role]);

  if (role !== "admin") {
    return <MainLayout>Access Denied</MainLayout>;
  }

  return (
    <MainLayout>
      <Table>
        {users.map(u => (
          <TableRow key={u._id}>
            <TableCell>{u.email}</TableCell>
            <TableCell>
              <Button onClick={() => deleteUser(u._id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </MainLayout>
  );
}