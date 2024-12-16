import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { PersonCircle, ThreeDotsVertical } from 'react-bootstrap-icons';
import { useSortable } from '@dnd-kit/sortable';
import { SortableCandidateProps } from '../../types/kanban';

export const SortableCandidate: React.FC<SortableCandidateProps> = React.memo(({ candidate, onClick }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: candidate.id });

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