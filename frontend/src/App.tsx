import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import SchedulesPage from "./pages/SchedulesPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/schedules" element={<SchedulesPage />} />
      </Routes>
    </div>
  );
}
