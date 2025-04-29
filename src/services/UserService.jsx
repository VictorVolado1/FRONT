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
    return api('POST', 'auth/register', payload)
      .then((response) => {
        console.log(response);
        this.navigate('/');
      })
      .catch((error) => {
        this.dispatchError(error);
      })
      .finally(() => {
        console.log('finally');
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
        this.navigate('/tasks');
      })
      .catch((error) => {
        this.dispatchError(error);
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });

  }

  clearUser() {
    localStorage.removeItem('token');
    this.dispatch(clearUser());
    this.navigate('/');
  }

  dispatchError(error) {
    if(error.response.status === 401) {
      this.dispatch(setError('Usuario o contraseña incorrectos'));
      return;
    }
    if(error.response.status === 400) {
      this.dispatch(setError('La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un caracter especial'));
      return
    }
  }

}

export default UserService;