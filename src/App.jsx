import { Login } from "./pages/Auth/Login";
import { Tasks } from "./pages/Tasks/Tasks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./router/PrivateRoute";
import { Navigate } from "react-router-dom";
function App() {

  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        {
          token ? 
            <Route path="*" element={<Navigate to="/tasks" replace />} />
              :
            <Route path="*" element={<Navigate to="/" replace />} />
        }
      </Routes>
    </Router>
  );

}

export default App;
