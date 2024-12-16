import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Badge, Toast, Button, Spinner } from 'react-bootstrap';
import { PersonCircle, ThreeDotsVertical, ArrowLeftCircle, GripVertical } from 'react-bootstrap-icons';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    useDroppable,
    DragOverlay,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { api } from '../services/api';
import { Candidate, KanbanColumn, InterviewFlowResponse } from '../types/interview';
import './KanbanBoardPosition.css';

const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5'
            }
        }
    })
};

const SortableCandidate = React.memo(({ candidate, onClick }: { candidate: Candidate; onClick: (candidate: Candidate) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ 
        id: candidate.id,
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
            <Card 
                className="mb-2 shadow-sm border-0" 
                style={{ 
                    transition: 'all 0.2s ease',
                    transform: isDragging ? 'rotate(3deg)' : 'none',
                    cursor: 'grab',
                    borderLeft: '4px solid #28a745'
                }}
            >
                <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex gap-2">
                            <div 
                                className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    backgroundColor: '#f8f9fa',
                                    border: '2px solid #e9ecef'
                                }}
                            >
                                <PersonCircle size={24} className="text-secondary" />
                            </div>
                            <div>
                                <h6 className="mb-1 fw-semibold">{candidate.name}</h6>
                                <small className="text-muted d-block">{candidate.current_interview_step}</small>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="d-flex gap-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            display: 'inline-block',
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: i < candidate.score ? '#28a745' : '#e9ecef',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                    />
                                ))}
                            </div>
                            <Button 
                                variant="link" 
                                className="p-0 text-secondary" 
                                style={{ opacity: 0.7 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick(candidate);
                                }}
                            >
                                <ThreeDotsVertical size={18} />
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
});

interface DroppableColumnProps {
    column: KanbanColumn;
    children: React.ReactNode;
}

const DroppableColumn = ({ column, children }: DroppableColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: column.id
    });

    return (
        <div 
            ref={setNodeRef}
            className="kanban-column rounded-3 p-3"
            style={{ 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
                <div className="d-flex align-items-center gap-2">
                    <h5 className="mb-0 fw-semibold" style={{ color: column.color }}>{column.title}</h5>
                    <Badge 
                        pill 
                        bg="light"
                        className="border"
                        style={{ color: column.color }}
                    >
                        {column.candidates.length}
                    </Badge>
                </div>
                <Button variant="link" className="p-0 text-secondary">
                    <ThreeDotsVertical size={18} />
                </Button>
            </div>
            <div className="kanban-column-content">
                {children}
            </div>
        </div>
    );
};

const styles = {
    kanbanBoardContainer: {
        '@media (max-width: 768px)': {
            padding: '10px 0',
        },
    },
    columnContainer: {
        '@media (max-width: 768px)': {
            width: '280px',
            minWidth: '280px',
        },
    },
    scrollContainer: {
        overflowX: 'auto',
        overflowY: 'hidden',
        padding: '20px 10px',
        minHeight: 'calc(100vh - 200px)',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: '-ms-autohiding-scrollbar',
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
            height: '8px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
        },
        '@media (max-width: 768px)': {
            padding: '10px 5px',
        },
    },
} as const;

const KanbanBoardPosition: React.FC = () => {
    const { positionId } = useParams<{ positionId: string }>();
    const [columns, setColumns] = useState<KanbanColumn[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [positionTitle, setPositionTitle] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                if (!positionId) return;
                
                const position = await api.getPosition(positionId);
                setPositionTitle(position.title);
                
                const flowData: InterviewFlowResponse = await api.getInterviewFlow(positionId);
                const candidates: Candidate[] = await api.getCandidatesByPosition(positionId);
                
                const initialColumns = flowData.stages.map(stage => ({
                    id: stage.id,
                    title: stage.name,
                    color: stage.color,
                    candidates: candidates.filter(c => c.current_interview_step === stage.name)
                }));

                setColumns(initialColumns);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error al cargar los datos. Por favor, intente de nuevo.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [positionId]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const previousColumns = [...columns];
        setError(null);

        try {
            const sourceColumn = columns.find(col => 
                col.candidates.some(c => c.id === active.id)
            );

            const destinationColumn = columns.find(col => col.id === over.id);

            if (!sourceColumn || !destinationColumn || sourceColumn.id === destinationColumn.id) return;

            const candidateToMove = sourceColumn.candidates.find(c => c.id === active.id);
            if (!candidateToMove) return;

            const newColumns = columns.map(col => {
                if (col.id === sourceColumn.id) {
                    return {
                        ...col,
                        candidates: col.candidates.filter(c => c.id !== active.id)
                    };
                }
                if (col.id === destinationColumn.id) {
                    return {
                        ...col,
                        candidates: [...col.candidates, { 
                            ...candidateToMove, 
                            status: destinationColumn.id,
                            current_interview_step: destinationColumn.title 
                        }]
                    };
                }
                return col;
            });

            setColumns(newColumns);
            await api.updateCandidateStatus(String(active.id), destinationColumn.id);
        } catch (error) {
            setColumns(previousColumns);
            setError('Error al actualizar el estado del candidato. Por favor, intente de nuevo.');
            console.error('Error updating candidate status:', error);
        }
    };

    const handleCandidateClick = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex flex-column bg-white">
            {error && (
                <Toast 
                    className="position-fixed top-0 end-0 m-3" 
                    bg="danger" 
                    onClose={() => setError(null)}
                    show={!!error}
                    delay={3000}
                    autohide
                >
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">Error</strong>
                        <Button variant="link" className="p-0 ms-2 text-dark" onClick={() => setError(null)}>
                            ×
                        </Button>
                    </Toast.Header>
                    <Toast.Body className="text-white">{error}</Toast.Body>
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
                    <h3 className="mb-0 ms-3 fw-bold">{positionTitle}</h3>
                </div>

                <div className="kanban-board-container">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="kanban-board-wrapper">
                            {columns.map(column => (
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

            {selectedCandidate && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                    <Toast 
                        onClose={() => setSelectedCandidate(null)} 
                        show={true} 
                        delay={3000} 
                        autohide
                        className="shadow-lg"
                    >
                        <Toast.Header closeButton={false} className="border-0">
                            <strong className="me-auto">{selectedCandidate.name}</strong>
                            <Button variant="link" className="p-0 ms-2 text-dark" onClick={() => setSelectedCandidate(null)}>
                                ×
                            </Button>
                        </Toast.Header>
                        <Toast.Body>
                            <p className="mb-2"><strong>ID:</strong> {selectedCandidate.applicationId}</p>
                            <p className="mb-2"><strong>Etapa:</strong> {selectedCandidate.current_interview_step}</p>
                            <p className="mb-0"><strong>Puntuación:</strong> {selectedCandidate.score}/5</p>
                        </Toast.Body>
                    </Toast>
                </div>
            )}
        </div>
    );
};

export default KanbanBoardPosition;