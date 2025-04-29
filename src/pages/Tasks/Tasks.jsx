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
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

export const Tasks = () => {

	const dispatch = useDispatch();

	const toast = useRef(null);

	const { tasksList } = useSelector((state) => state.tasks);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState(null);
	const [datesCreated, setDatesCreated] = useState(null);
	const [datesUpdated, setDatesUpdated] = useState(null);

	const tasksService = new TasksService();

	const statusOptions = [
		{ label: 'Todos', value: true },
		{ label: 'Pendiente', value: 0 },
		{ label: 'Finalizada', value: 1 },
	];

	const clearFilters = () => {
		setStatusFilter(null);
		setDatesCreated(null);
		setDatesUpdated(null);
	};

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

	const exportTasks = () => {

		const params = {
			completed: statusFilter,
			createdAt: formatRange(datesCreated),
			updatedAt: formatRange(datesUpdated)
		}

		const cleanedParams = Object.fromEntries(
			Object.entries(params).filter(([_, v]) => v !== null)
		);

		tasksService.exportTasks(cleanedParams);
		
	};

	const formatRange = (range) => {
		if (!range || range.length === 0) return null;
	
		const start = range[0];
		const end = range[1] || range[0]; 
	
		return {
			from: moment(start).format('YYYY-MM-DD'),
			to: moment(end).format('YYYY-MM-DD'),
		};
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
			<div style={{ width: "80%", margin: "0 auto" }}>
			<Accordion>
  <AccordionTab header="EXPORTAR TAREAS">
    <div className="flex flex-wrap gap-5 justify-content-center mb-4">
      <div className="flex flex-column align-items-start">
        <label className="text-900 font-medium mb-2">Estatus</label>
        <Dropdown
          value={statusFilter}
          options={statusOptions}
          onChange={(e) => setStatusFilter(e.value)}
          placeholder="Filtrar por estatus"
          className="w-18rem"
        />
      </div>
      <div className="flex flex-column align-items-start">
        <label className="text-900 font-medium mb-2">Rango de fechas Creacion</label>
        <Calendar
          value={datesCreated}
          onChange={(e) => setDatesCreated(e.value)}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          className="w-20rem"
					inputId="Cracion"
        />
      </div>
			<div className="flex flex-column align-items-start">
        <label className="text-900 font-medium mb-2">Rango de fechas Ultima Actualizacion</label>
        <Calendar
          value={datesUpdated}
          onChange={(e) => setDatesUpdated(e.value)}
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          className="w-20rem"
					inputId="Ultima actualizacion"
        />
      </div>
    </div>

    <div className="flex justify-content-center gap-3">
      <Button
        label="Limpiar"
        icon="pi pi-filter-slash"
        severity="secondary"
        outlined
        onClick={clearFilters}
      />
      <Button
        label="Exportar"
        icon="pi pi-file-excel"
        severity="success"
        outlined
        onClick={exportTasks}
      />
    </div>
  </AccordionTab>
</Accordion>

				<SearchBar
					onAdd={() => {
						setIsModalOpen(true);
					}}
				/>
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
			</div>

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
