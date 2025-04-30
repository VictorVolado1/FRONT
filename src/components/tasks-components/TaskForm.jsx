import { useForm } from "../../hooks/useForm";
import { useSelector, useDispatch } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { setError } from "../../slices/tasks";
import TasksService from "../../services/Tasks";

export const TaskForm = ({ onClose }) => {

  const tasksService = new TasksService();

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.tasks);

  const { 
    name, 
    description, 
    onInputChange, 
    formState 
  } = useForm({
    name: "",
    description: "",
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await tasksService.createTask(formState);
      
      onClose();
    }
    catch (err) {
      dispatch(setError(err.message || "Error al crear la tarea"));
    }
  };

  return (
    <div className="w-full">
      {error && (
        <Message severity="error" text={error} className="w-full mb-3" />
      )}

      <form onSubmit={handleCreateTask}>
        <div className="mb-3">
          <label htmlFor="name" className="block text-900 font-medium mb-2">
            Nombre de la tarea
          </label>
          <InputText
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={onInputChange}
            placeholder="nombre"
            className="w-full"
            required
            onInvalid={(e) => e.target.setCustomValidity('El Nombre es obligatorio')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="description"
            className="block text-900 font-medium mb-2"
          >
            Descripción
          </label>
          <InputText
            id="description"
            name="description"
            type="text"
            value={description}
            onChange={onInputChange}
            placeholder="Descripción"
            className="w-full"
            required
            onInvalid={(e) => e.target.setCustomValidity('La descripción es obligatoria')}
            onInput={(e) => e.target.setCustomValidity('')}
          />
        </div>

        <Button
          label={isLoading ? "Cargando..." : "GUARDAR"}
          className="w-full"
          disabled={isLoading}
          type="submit"
          severity="info"
          icon="pi pi-save"
          loading={isLoading}
          outlined
        />
      </form>
    </div>
  );
};