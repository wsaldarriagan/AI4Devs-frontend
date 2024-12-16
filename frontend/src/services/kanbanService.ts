import { api } from './api';
import { KanbanColumn } from '../types/kanban';
import { Candidate, InterviewFlowResponse } from '../types/interview';

export class KanbanService {
    private static instance: KanbanService;

    private constructor() {}

    public static getInstance(): KanbanService {
        if (!KanbanService.instance) {
            KanbanService.instance = new KanbanService();
        }
        return KanbanService.instance;
    }

    public async getInitialData(positionId: string): Promise<{
        columns: KanbanColumn[];
        positionTitle: string;
    }> {
        try {
            const position = await api.getPosition(positionId);
            const flowData: InterviewFlowResponse = await api.getInterviewFlow(positionId);
            const candidates: Candidate[] = await api.getCandidatesByPosition(positionId);

            const columns = flowData.stages.map(stage => ({
                id: stage.id,
                title: stage.name,
                color: stage.color,
                candidates: candidates.filter(c => c.current_interview_step === stage.name)
            }));

            return {
                columns,
                positionTitle: position.title
            };
        } catch (error) {
            console.error('Error fetching kanban data:', error);
            throw new Error('Error al cargar los datos del tablero Kanban');
        }
    }

    public async updateCandidateStatus(
        candidateId: string, 
        sourceColumnId: string, 
        destinationColumnId: string,
        columns: KanbanColumn[]
    ): Promise<KanbanColumn[]> {
        try {
            const sourceColumn = columns.find(col => col.id === sourceColumnId);
            const destinationColumn = columns.find(col => col.id === destinationColumnId);

            if (!sourceColumn || !destinationColumn) {
                throw new Error('Columnas no encontradas');
            }

            const candidateToMove = sourceColumn.candidates.find(c => c.id === candidateId);
            if (!candidateToMove) {
                throw new Error('Candidato no encontrado');
            }

            await api.updateCandidateStatus(candidateId, destinationColumnId);

            return columns.map(col => {
                if (col.id === sourceColumnId) {
                    return {
                        ...col,
                        candidates: col.candidates.filter(c => c.id !== candidateId)
                    };
                }
                if (col.id === destinationColumnId) {
                    return {
                        ...col,
                        candidates: [...col.candidates, {
                            ...candidateToMove,
                            status: destinationColumnId,
                            current_interview_step: destinationColumn.title
                        }]
                    };
                }
                return col;
            });
        } catch (error) {
            console.error('Error updating candidate status:', error);
            throw new Error('Error al actualizar el estado del candidato');
        }
    }
} 