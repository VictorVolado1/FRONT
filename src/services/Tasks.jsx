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
        if  (error.response.status === 401) {
          this.navigate('/');
        }
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
        if  (error.response.status === 401) {
          this.navigate('/');
        }
        this.dispatch(setError(error.response.data || error.message));
      })
  }

  updateTask(payload) {

    const { id } = payload;

    const newPayload = {
      completed: true
    }
  
    return api('PATCH', `tasks/${id}/`, newPayload)
      .then((response) => {
        this.clearTasks(); 
        this.getTasks();
      })
      .catch((error) => {
        this.dispatch(setError(error.response.data || error.message));
      })

  }

  clearTasks() {
    this.dispatch(clearTasks());
  }

  exportTasks(payload) {
    return api('POST', 'tasks/export/', payload, {}, {
      responseType: 'blob',
    }).then((response) => {
      const blob = new Blob([response.data], {
        type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
  
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
  
      const disposition = response.headers['content-disposition'];
      let filename = 'tareas.xlsx';
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/["']/g, '');
      }
  
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }).catch((error) => {
      if (error.response?.status === 401) {
        this.navigate('/');
      }
      this.dispatch(setError(error.response?.data || error.message));
    });
  }
  
  

}

export default TasksService;