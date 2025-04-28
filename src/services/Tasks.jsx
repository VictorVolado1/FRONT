import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useToast } from '../hooks/useToast';
import { clearTasks, setTasks } from '../slices/tasks';
import { setIsLoading } from '../slices/tasks';
import api from '../utils/api';

class TasksService {
  
  constructor() {
    this.dispatch = useDispatch();
    this.navigate = useNavigate();
    this.showToast = useToast().showToast;
  }

  createTask(payload) {

    this.dispatch(setIsLoading(true));
    
    return api('POST', 'tasks/', payload)
      .then((response) => {
        this.showToast('Se ha registrado correctamente!', 'success');
        this.navigate('/tasks');
      })
      .catch((error) => {
        this.dispatch(setError(error.response.data || error.message));
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });
  
    }

  // Obtener Tasks
  getTasks() {
    return api('GET', 'tasks/')
      .then((response) => {
        if (response) {
          this.dispatch(setTasks(response));
        }
      })
      .catch((error) => {});
  }

  clearTasks() {
    this.dispatch(clearTasks());
  }
  
}

export default TasksService;