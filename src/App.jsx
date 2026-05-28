import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";

import Doctors from "./pages/Doctors/Doctors";
import Equipment from "./pages/Equipment/Equipment";
import Notifications from "./pages/Notifications";
import Specialties from "./pages/Specialties/Specialty";
import Users from "./pages/Users/Users";
import Bookings from "./pages/Bookings/Bookings";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/bookings" replace />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="users" element={<Users />} />
          <Route path="specialties" element={<Specialties />} />
          <Route path="equipment" element={<Equipment />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
