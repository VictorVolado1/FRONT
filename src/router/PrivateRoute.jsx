import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import UserService from "../services/UserService";

export const PrivateRoute = ({ children }) => {
  const userService = new UserService();
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    if (Object.keys(user).length === 0 && token) {
      await userService.getCurrentUser();
    }
    setIsLoading(false);
  };

  if (isLoading) return null;
  if (!token) return <Navigate to="/" />;
  return children;
};