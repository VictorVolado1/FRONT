import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setIsLoading, setUser, setError, setSuccess, clearUser } from '../slices/user';
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
        return true;
      })
      .catch((error) => {
        this.dispatch(setError(error));
      }).finally(() => {
        this.dispatch(setIsLoading(false));
      })
  }

  // Login de usuario
  logInUser(payload) {

    const { name, ...payloadWithoutName } = payload;

    api('POST', 'auth/login', payloadWithoutName)
      .then((response) => {
        console.log('1')
        localStorage.setItem('token', response.token);
        this.dispatch(setUser(response.user));
        this.navigate('/tasks');
      })
      .catch((error) => {
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });

  }

}

export default UserService;