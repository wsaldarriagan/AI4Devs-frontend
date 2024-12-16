import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { useDroppable } from '@dnd-kit/core';
import { DroppableColumnProps } from '../../types/kanban';

export const DroppableColumn: React.FC<DroppableColumnProps> = ({ column, children }) => {
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