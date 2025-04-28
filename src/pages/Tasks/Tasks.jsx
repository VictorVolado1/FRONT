import React, { useEffect } from 'react';
import TasksService from '../../services/Tasks';
import { useSelector } from 'react-redux';

export const Tasks = () => {

    const { tasksList, error } = useSelector((state) => state.tasks);
    
    const tasksService = new TasksService();

    useEffect(() => {
        try {
            tasksService.getTasks();
        } catch (err) {
            dispatch(setError(err || "Error al iniciar sesión"));
        }

        return () => {
            tasksService.clearTasks();
        };
    }, []);

    if(tasksList.length === 0) {
        return <div>No hay tareas disponibles</div>;
    }

    return (
        <div>
            <h1>Tareas</h1>
            {tasksList.map((task) => (
                <div key={task.id}>
                    <h2>{task.title}</h2>
                    <p>{task.description}</p>
                </div>
            ))}
        </div>
    );

};