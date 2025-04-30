import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { clearTasks, setError, setTasks } from '../slices/tasks';
import { setIsLoading } from '../slices/tasks';
import { showToast } from '../utils/toastService';

import api from '../utils/api';

class TasksService {
  
  constructor() {
    this.dispatch = useDispatch();
    this.navigate = useNavigate();
  }

  createTask(payload) {
    this.dispatch(setIsLoading(true));
    
    return api('POST', 'tasks/', payload)
      .then((response) => {
        showToast('success', 'Tarea creada', 'La tarea fue creada correctamente');
      })
      .catch((error) => {
        this.dispatch(setError(error.response?.data || error.message));
        showToast('error', 'Error', 'Error al crear la tarea');
      })
      .finally(() => {
        this.dispatch(setIsLoading(false));
        this.clearTasks();
        this.getTasks();
      });
  }

  getTasks() {
    this.dispatch(setIsLoading(true));
    return api('GET', 'tasks/')
      .then((response) => {
          this.dispatch(setTasks(response));
      })
      .catch((error) => {
        if  (error.response.status === 401) {
          this.navigate('/');
        }
        showToast('error', 'Tarea creada', 'La tarea fue creada correctamente');
      }).finally(() => {
        this.dispatch(setIsLoading(false));
      }
      );
  }

  deleteTask(payload) {

    this.dispatch(setIsLoading(true));
    console.log('entro')
    return api('DELETE', `tasks/${payload.id}/`)
      .then(() => {
        showToast('success', 'Tarea eliminada', 'La tarea fue eliminada correctamente');        
        this.clearTasks(); 
        this.getTasks();
      })
      .catch((error) => {
        if  (error.response.status === 401) {
          this.navigate('/');
        }
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
        showToast('success', 'Tarea actualizada', 'La tarea fue actualizada correctamente');
      })
      .catch((error) => {
        showToast('error', 'Error', 'Error al actualizar la tarea');
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
      showToast('success', 'Exportación exitosa', 'Las tareas fueron exportadas correctamente');
    }).catch((error) => {
      if (error.response?.status === 401) {
        this.navigate('/');
      }
      showToast('error', 'Error', 'Error al exportar las tareas');
    });
  }
  
}

export default TasksService;