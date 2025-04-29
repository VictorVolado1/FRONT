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
        this.dispatch(clearTasks());
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
        this.getTasks();
      });
  }

  getTasks() {
    this.dispatch(setIsLoading(true));
    return api('GET', 'tasks/')
      .then((response) => {
        if (response) {
          this.dispatch(setTasks(response));
        }
      })
      .catch((error) => {
        this.dispatch(setError(error.response.data || error.message));
        this.dispatch(setIsLoading(true));
      }).finally(() => {
        this.dispatch(setIsLoading(false));
      }
      );
  }

  deleteTask(payload) {

    this.dispatch(setIsLoading(true));
    
    return api('DELETE', `tasks/${payload.id}/`)
      .then(() => {
        this.clearTasks(); 
        this.getTasks();
      })
      .catch((error) => {
        this.dispatch(setError(error.response.data || error.message));
        this.dispatch(setIsLoading(false));
      })
  }

  updateTask(payload) {

    this.dispatch(setIsLoading(true));
  
    const { id } = payload;

    const newPayload = {
      completed: true
    }
  
    return api('PATCH', `tasks/${id}/`, newPayload)
      .then((response) => {
        this.getTasks();
      })
      .catch((error) => {
        this.dispatch(setError(error.response?.data || error.message));
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
      });

  }

  clearTasks() {
    this.dispatch(clearTasks());
  }

}

export default TasksService;