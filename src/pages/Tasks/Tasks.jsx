import moment from "moment";
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { TaskForm } from "../../components/tasks-components/TaskForm";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Tag } from "primereact/tag";
import { AccordionExportTasks } from "../../components/tasks-components/Accordion";
import TasksService from '../../services/Tasks';
import { TopBar } from "../../components/tasks-components/TopBar";

export const Tasks = () => {

	const { tasksList } = useSelector((state) => state.tasks);

	const [isModalOpen, setIsModalOpen] = useState(false);

	const tasksService = new TasksService();

	useEffect(() => {
		tasksService.getTasks();
		return () => {
			tasksService.clearTasks();
		};
	}, []);

	const confirmDelete = (task) => {
		confirmDialog({
			message: "¿Desea Eliminar la tarea?",
			header: "Confirmación",
			icon: "pi pi-exclamation-triangle",
			accept: () => {
				tasksService.deleteTask(task)
					.then(() => {
						tasksService.getTasks();
					})
					.catch(() => {
						
					});
			},
		});
	};

	const confirmUpdate = (task) => {
		confirmDialog({
			message: "¿Desea finalizar la tarea?",
			header: "Confirmación",
			icon: "pi pi-exclamation-triangle",
			accept: () => {
				tasksService.updateTask(task)
					.then(() => {
						tasksService.getTasks();
					})
					.catch(() => {
			
					});
			},
		});
	};

	const actionBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button
					icon="pi pi-check" rounded outlined aria-label="Finalizar"
					severity="success"
					tooltip="Finalizar"
					onClick={() => confirmUpdate(rowData)}
					style={{ marginRight: ".5em", width: "2em", height: "2em" }}
					disabled={rowData.completed}
					tooltipOptions={{ position: "top" }}
				/>
				<Button
					icon="pi pi-trash" rounded outlined aria-label="Finalizar"
					severity="danger"
					tooltip="Eliminar tarea"
					onClick={() => confirmDelete(rowData)}
					tooltipOptions={{ position: "top" }}
					style={{ width: "2em", height: "2em" }}
				/>
			</React.Fragment>
		);
	};

	const statusBodyTemplate = (rowData) => {
		return (
			<Tag
				value={rowData.completed ? "Finalizada" : "Pendiente"}
				severity={rowData.completed ? "success" : "warning"}
				icon={rowData.completed ? "pi pi-check" : "pi pi-clock"}
			/>
		);
	};

	const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">MIS TAREAS</span>
            <Button 
				label="AGREGAR" 
				severity="info" 
				outlined 
				onClick={() => setIsModalOpen(true)}/>
        </div>
    );


	return (
		<div>
			<TopBar/>
			<div style={{ width: "80%", margin: "0 auto" }}>
				<AccordionExportTasks />
				<DataTable
					header={header}
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
						field="completed"
						header="Estatus"
						sortable
						body={statusBodyTemplate}
						filter
						filterMenuStyle={{ width: '14rem' }}
						style={{ minWidth: '12rem' }}
					/>
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
			</div>

			<Dialog
				header="Nueva tarea"
				visible={isModalOpen}
				style={{ width: "20vw" }}
				onHide={() => setIsModalOpen(false)}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
			>
				<TaskForm onClose={() => setIsModalOpen(false)} />
			</Dialog>
			<ConfirmDialog acceptLabel="Confirmar" rejectLabel="Cancelar" />
		</div>
	);
};
