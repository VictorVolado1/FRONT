import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useToast } from '../hooks/useToast';
import { setIsLoading, setUser, logOut, setError } from '../slices/user';
import api from '../utils/api';

class UserService {
  
  constructor() {
    this.dispatch = useDispatch();
    this.navigate = useNavigate();
    this.showToast = useToast().showToast;
  }

  signUpUser(payload) {
    this.dispatch(setIsLoading(true));
    return api('POST', 'auth/signup', payload)
      .then((response) => {
        localStorage.setItem('token', response.token);
        this.dispatch(setUser(response.user));
        this.showToast('Se ha registrado correctamente!', 'success');
        this.navigate('/dashboard');
      })
      .catch((error) => {
        this.dispatch(setError(error.response.data || error.message));
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });
  }

  // Login de usuario
  logInUser(payload) {
    localStorage.removeItem('token');
    this.dispatch(setIsLoading(true));
    api('POST', 'auth/login', payload)
      .then((response) => {
        localStorage.setItem('token', response.token);
        this.dispatch(setUser(response.user));
        this.showToast('Se ha iniciado sesión!', 'success');
        this.navigate('/tasks');
      })
      .catch((error) => {
        this.dispatch(setError(error.response.data.description || error.message));
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });
  }

  // Cerrar sesion
  logOutUser() {
    localStorage.removeItem('token');
    this.dispatch(logOut());
    this.navigate('/login');
    this.showToast('Se ha cerrado la sesión correctamente!', 'success');
  }

  // Obtener usuario de la sesion
  getCurrentUser() {
    return api('GET', 'users/me')
      .then((response) => {
        if (response.idUser) {
          this.dispatch(setUser(response));
        }
      })
      .catch((error) => {});
  }
}

export default UserService;