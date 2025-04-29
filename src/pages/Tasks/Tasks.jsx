import moment from "moment";
import React, { useEffect, useRef, useState } from 'react';
import TasksService from '../../services/Tasks';
import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";
import { SearchBar } from "../../components/SearchBar";
import { Dialog } from "primereact/dialog";
import { TaskForm } from "../../components/TaskForm";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

export const Tasks = () => {
	
	const dispatch = useDispatch();
	const toast = useRef(null);

	const { tasksList } = useSelector((state) => state.tasks);

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

	const confirmDelete = (task) => {
		confirmDialog({
			message: "¿Desea Eliminar la tarea?",
			header: "Confirmación",
			icon: "pi pi-exclamation-triangle",
			accept: () => {
				tasksService.deleteTask(task)
					.then(() => {
						toast.current.show({
							severity: "success",
							summary: "Éxito",
							detail: "Tarea eliminada correctamente"
						});
						tasksService.getTasks();
					})
					.catch(() => {
						toast.current.show({
							severity: "error",
							summary: "Error",
							detail: "Error al eliminar tarea"
						});
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
						toast.current.show({
							severity: "success",
							summary: "Éxito",
							detail: "Tarea actualizada correctamente"
						});
						tasksService.getTasks();
					})
					.catch(() => {
						toast.current.show({
							severity: "error",
							summary: "Error",
							detail: "Error al actualizar tarea"
						});
					});
			},
		});
	};

	const actionBodyTemplate = (rowData) => {
		return (
			<React.Fragment>
				<Button
					icon="pi pi-check"
					className="p-button-rounded p-button-success"
					tooltip="Terminar"
					onClick={() => confirmUpdate(rowData)}
					style={{ marginRight: ".5em", width: "2em", height: "2em" }}
					disabled={rowData.completed}
					tooltipOptions={{ position: "top" }}
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-danger"
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
			</>

			<Dialog
				header="Nueva tarea"
				visible={isModalOpen}
				style={{ width: "20vw" }}
				onHide={() => setIsModalOpen(false)}
				breakpoints={{ "960px": "75vw", "641px": "90vw" }}
			>
				<TaskForm onClose={() => setIsModalOpen(false)} toast={toast} />
			</Dialog>
			<Toast ref={toast} />
			<ConfirmDialog acceptLabel="Confirmar" rejectLabel="Cancelar" />
		</div>
	);
};
