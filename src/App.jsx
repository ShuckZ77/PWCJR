import AuthGate from "./components/AuthGate";
import Navbar from "./Navbar";
import DataTableNew from "./components/datatable/DataTableNew";
import { Toolbar, Container, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <AuthGate>
      <Navbar />
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Routes>
        <Route path="PWCJR/" element={<DataTableNew />} />
        {/* More protected routes here */}
      </Routes>
    </AuthGate>
  );
}

export default App;
