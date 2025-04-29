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
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });
  }

  // Login de usuario
  logInUser(payload) {

    this.dispatch(setIsLoading(true));

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
        console.log(error.response.status);
        if(error.response.status === 401) {
          this.dispatch(setError('Usuario o contraseña incorrectos'));
          return;
        }
        if(error.response.status === 400) {
          this.dispatch(setError('La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un caracter especial'));
          return
        }
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