import { Candidate } from './interview';

export interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    candidates: Candidate[];
}

export interface KanbanBoardProps {
    positionId: string;
}

export interface DroppableColumnProps {
    column: KanbanColumn;
    children: React.ReactNode;
}

export interface SortableCandidateProps {
    candidate: Candidate;
    onClick: (candidate: Candidate) => void;
}

export interface KanbanState {
    columns: KanbanColumn[];
    isLoading: boolean;
    error: string | null;
    selectedCandidate: Candidate | null;
    positionTitle: string;
} 