import moment from "moment";
import React, { useEffect, useState } from 'react';
import TasksService from '../../services/Tasks';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { SearchBar } from "../../components/SearchBar";
import { Dialog } from "primereact/dialog";
import { TaskForm } from "../../components/TaskForm";

export const Tasks = () => {
	
	const { tasksList, error } = useSelector((state) => state.tasks);

	const [isModalOpen, setIsModalOpen] = useState(false);

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

	const actionBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button
					icon="pi pi-check"
					className="p-button-rounded p-button-success"
					tooltip="Terminar"
					onClick={() => null}
					style={{ marginRight: ".5em", width: "2em", height: "2em" }}
					disabled={rowData.covered}
					tooltipOptions={{ position: "top" }}
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-danger"
					tooltip="Eliminar tarea"
					onClick={() => null}
					tooltipOptions={{ position: "top" }}
					style={{ width: "2em", height: "2em" }}
				/>
			</React.Fragment>
		);
	};

	return (
		<div>
			<SearchBar
				onAdd={() => {
					setIsModalOpen(true);
				}}
			/>
			<>
				<DataTable
					value={tasksList}
					stripedRows
					size="small"
					removableSort
					scrollable
					scrollHeight="73vh"
					emptyMessage="Sin tareas registradas"
				>
					<Column field="id" header="ID" sortable />
					<Column field="name" header="Nombre" sortable />
					<Column field="description" header="Descripcion" sortable />
					<Column
						body={({ createdAt }) => {
							return moment(createdAt).format("DD-MM-YYYY");
						}}
						field="createdAt"
						header="Creacion"
						sortable
					/>
					<Column
						body={({ updatedAt }) => {
							return updatedAt ? moment(updatedAt).format("DD-MM-YYYY") : "-";
						}}
						header="Ultima actualizacion"
						field="updatedAt"
						sortable
					/>
					<Column
						body={actionBodyTemplate}
						header="Opciones"
						exportable={false}
					/>
				</DataTable>
			</>

			<Dialog
				header="Nueva tarea"
				visible={isModalOpen}
				style={{ width: "20vw" }}
				onHide={() => setIsModalOpen(false)}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
			>
				<TaskForm />
			</Dialog>

		</div>
	);
};
