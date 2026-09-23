import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Candidates from "./pages/Candidates";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/candidates" element={<Candidates />} />
        </Route>

        <Route path="/" element={<Navigate to="/candidates" replace />} />
        <Route path="*" element={<Navigate to="/candidates" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;