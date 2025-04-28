import React, { useEffect } from 'react';
import TasksService from '../../services/Tasks';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TopBar } from '../../components/TopBar';   

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
        <TopBar />
        <h1>Tareas</h1>
        <DataTable value={tasksList}>
            <Column field="id" header="ID" />
            <Column field="description" header="Descripción" />
            <Column field="createdAt" header="Fecha de Creación" />
            <Column field="createdAt" header="Ultima Modificación" />
        </DataTable>
    </div>
    );

};