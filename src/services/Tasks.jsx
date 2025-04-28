import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useToast } from '../hooks/useToast';
import { clearTasks, setError, setTasks } from '../slices/tasks';
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
        this.showToast({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Tarea creada correctamente'
        });
        this.clearTasks(); 
        this.getTasks();
      })
      .catch((error) => {
        this.dispatch(setError(error.response?.data || error.message));
        this.showToast({
          severity: 'error',
          summary: 'Error',
          detail: error.response?.data?.message || 'Error al crear tarea'
        });
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });
  }

  getTasks() {
    return api('GET', 'tasks/')
      .then((response) => {
        if (response) {
          this.dispatch(setTasks(response));
        }
      })
      .catch((error) => {
        this.dispatch(setError(error.response.data || error.message));
      });
  }

  clearTasks() {
    this.dispatch(clearTasks());
  }

}

export default TasksService;