import { Login } from "./pages/Auth/Login";
import { Tasks } from "./pages/Tasks/Tasks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./router/PrivateRoute";
import { Navigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { setToast } from "./utils/toastService";
import { useRef, useEffect } from "react";

function App() {

  const token = localStorage.getItem("token");

  const toast = useRef(null);

  useEffect(() => {
    setToast(toast);
  });

  return (
    <>
      <Toast ref={toast} />
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
    </>
  );

}

export default App;
