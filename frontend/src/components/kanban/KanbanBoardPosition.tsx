import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Toast, Button, Spinner } from 'react-bootstrap';
import { ArrowLeftCircle } from 'react-bootstrap-icons';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { KanbanService } from '../../services/kanbanService';
import { DroppableColumn } from './DroppableColumn';
import { SortableCandidate } from './SortableCandidate';
import { KanbanState } from '../../types/kanban';
import './KanbanBoardPosition.css';

const initialState: KanbanState = {
    columns: [],
    isLoading: true,
    error: null,
    selectedCandidate: null,
    positionTitle: ''
};

const KanbanBoardPosition: React.FC = () => {
    const { positionId } = useParams<{ positionId: string }>();
    const [state, setState] = useState<KanbanState>(initialState);
    const kanbanService = KanbanService.getInstance();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                setState(prev => ({ ...prev, isLoading: true, error: null }));
                if (!positionId) return;

                const { columns, positionTitle } = await kanbanService.getInitialData(positionId);
                setState(prev => ({
                    ...prev,
                    columns,
                    positionTitle,
                    isLoading: false
                }));
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    error: 'Error al cargar los datos. Por favor, intente de nuevo.',
                    isLoading: false
                }));
            }
        };

        fetchData();
    }, [positionId]);

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const sourceColumn = state.columns.find(col => 
            col.candidates.some(c => c.id === active.id)
        );

        if (!sourceColumn) return;

        try {
            setState(prev => ({ ...prev, error: null }));
            const updatedColumns = await kanbanService.updateCandidateStatus(
                String(active.id),
                sourceColumn.id,
                String(over.id),
                state.columns
            );
            setState(prev => ({ ...prev, columns: updatedColumns }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: 'Error al actualizar el estado del candidato. Por favor, intente de nuevo.'
            }));
        }
    };

    const handleCandidateClick = (candidate: typeof state.selectedCandidate) => {
        setState(prev => ({ ...prev, selectedCandidate: candidate }));
    };

    if (state.isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex flex-column bg-white">
            {state.error && (
                <Toast 
                    className="position-fixed top-0 end-0 m-3" 
                    bg="danger" 
                    onClose={() => setState(prev => ({ ...prev, error: null }))}
                    show={!!state.error}
                    delay={3000}
                    autohide
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Error</strong>
                        <Button 
                            variant="link" 
                            className="p-0 ms-2 text-dark" 
                            onClick={() => setState(prev => ({ ...prev, error: null }))}
                        >
                            ×
                        </Button>
                    </Toast.Header>
                    <Toast.Body className="text-white">{state.error}</Toast.Body>
                </Toast>
            )}

            <Container fluid className="py-4">
                <div className="d-flex align-items-center mb-4">
                    <Button 
                        variant="link" 
                        className="text-decoration-none text-secondary p-0"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeftCircle size={20} className="me-2" />
                        Volver
                    </Button>
                    <h3 className="mb-0 ms-3 fw-bold">{state.positionTitle}</h3>
                </div>

                <div className="kanban-board-container">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="kanban-board-wrapper">
                            {state.columns.map(column => (
                                <DroppableColumn key={column.id} column={column}>
                                    <SortableContext
                                        items={column.candidates.map(c => c.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {column.candidates.map((candidate) => (
                                            <SortableCandidate 
                                                key={candidate.id} 
                                                candidate={candidate}
                                                onClick={handleCandidateClick}
                                            />
                                        ))}
                                    </SortableContext>
                                </DroppableColumn>
                            ))}
                        </div>
                    </DndContext>
                </div>
            </Container>

            {state.selectedCandidate && (
                <Toast 
                    onClose={() => setState(prev => ({ ...prev, selectedCandidate: null }))} 
                    show={true} 
                    delay={3000} 
                    autohide
                    className="position-fixed top-0 end-0 p-3 shadow-lg"
                >
                    <Toast.Header closeButton={false} className="border-0">
                        <strong className="me-auto">{state.selectedCandidate.name}</strong>
                        <Button 
                            variant="link" 
                            className="p-0 ms-2 text-dark" 
                            onClick={() => setState(prev => ({ ...prev, selectedCandidate: null }))}
                        >
                            ×
                        </Button>
                    </Toast.Header>
                    <Toast.Body>
                        <p className="mb-2"><strong>ID:</strong> {state.selectedCandidate.applicationId}</p>
                        <p className="mb-2"><strong>Etapa:</strong> {state.selectedCandidate.current_interview_step}</p>
                        <p className="mb-0"><strong>Puntuación:</strong> {state.selectedCandidate.score}/5</p>
                    </Toast.Body>
                </Toast>
            )}
        </div>
    );
};

export default KanbanBoardPosition; 