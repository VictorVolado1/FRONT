import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useToast } from '../hooks/useToast';
import { setIsLoading, setUser, clearUser, setError } from '../slices/user';
import api from '../utils/api';

class UserService {
  
  constructor() {
    this.dispatch = useDispatch();
    this.navigate = useNavigate();
    this.showToast = useToast().showToast;
  }

  signUpUser(payload) {

    this.dispatch(setIsLoading(true));

    return api('POST', 'auth/register', payload)
      .then((response) => {
        this.navigate('/');
      })
      .catch((error) => {
        this.dispatch(setError(error.response.data || error.message));
        this.dispatch(setIsLoading(false));
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });
  }

  // Login de usuario
  logInUser(payload) {

    localStorage.removeItem('token');

    const { name, ...payloadWithoutName } = payload;

    api('POST', 'auth/login', payloadWithoutName)
      .then((response) => {
        localStorage.setItem('token', response.token);
        this.dispatch(setUser(response.user));
        this.showToast('Se ha iniciado sesión!', 'success');
        this.navigate('/tasks');
      })
      .catch((error) => {
        console.error(error);
        this.dispatch(setError(error.response.data.description || error.message));
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });

  }

  // Cerrar sesion
  clearUser() {
    localStorage.removeItem('token');
    this.dispatch(clearUser());
    this.navigate('/login');
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