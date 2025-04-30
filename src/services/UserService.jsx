import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setIsLoading, setUser, setLoginInfo, clearUser } from '../slices/user';
import api from '../utils/api';

class UserService {
  
  constructor() {
    this.dispatch = useDispatch();
    this.navigate = useNavigate();
  }

  signUpUser(payload) {

    this.dispatch(setIsLoading(true));

    return api('POST', 'auth/register', payload)
      .then(() => {
        this.dispatch(setLoginInfo({
          severity: 'success', 
          message: 'Registro exitoso, redirigiendo a la página de inicio de sesión.',
        }));
      })
      .catch((error) => {
        if(error.status === 400){
          this.dispatch(setLoginInfo({
            severity: 'error',
            message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un caracter especial.',
          }));
        }
        if(error.status === 409){
          this.dispatch(setLoginInfo({
            severity: 'error',
            message: 'El correo ya está en uso.',
          }));
        }
        if(error.message === 'Network Error'){
          this.dispatch(setLoginInfo({
            severity: 'error',
            message: 'Error interno del servidor.',
          }));
        }
      }).finally(() => {
        this.dispatch(setIsLoading(false));
      })

  }

  logInUser(payload) {

    const { name, ...payloadWithoutName } = payload;

    api('POST', 'auth/login', payloadWithoutName)
      .then((response) => {
        this.clearUser();
        localStorage.setItem('token', response.token);
        this.dispatch(setUser(response.user));
        this.navigate('/tasks');
      })
      .catch((error) => {
        console.log(error);
        if(error.status === 400 || error.status === 401){
          this.dispatch(setLoginInfo({
            severity: 'error',
            message: 'El correo o la contraseña son incorrectos.',
          }));
        }
        if(error.message === 'Network Error'){
          this.dispatch(setLoginInfo({
            severity: 'error',
            message: 'Error interno del servidor.',
          }));
        }
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });

  }

  clearUser() {
    localStorage.removeItem('token');
    this.dispatch(clearUser());
  }

}

export default UserService;