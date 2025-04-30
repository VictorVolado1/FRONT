import React, {useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from "primereact/button";
import TasksService from '../services/Tasks';

export const AccordionExportTasks = () => {

    const tasksService = new TasksService();

    const [statusFilter, setStatusFilter] = useState(null);
    const [datesCreated, setDatesCreated] = useState(null);
    const [datesUpdated, setDatesUpdated] = useState(null);

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

	const formatRange = (range) => {
		if (!range || range.length === 0) return null;
	
		const start = range[0];
		const end = range[1] || range[0]; 
	
		return {
			from: moment(start).format('YYYY-MM-DD'),
			to: moment(end).format('YYYY-MM-DD'),
		};
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

    return (
        <div>
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
        </div>
    );
};
