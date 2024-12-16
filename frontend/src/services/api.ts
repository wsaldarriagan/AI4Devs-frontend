import { InterviewFlowResponse, Candidate } from '../types';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

interface Position {
    id: number;
    title: string;
    manager: string;
    deadline: string;
    status: string;
}

// Mock data para posiciones
const MOCK_POSITIONS: { [key: string]: Position } = {
    "1": { id: 1, title: 'Senior Backend Engineer', manager: 'John Doe', deadline: '2024-12-31', status: 'Abierto' },
    "2": { id: 2, title: 'Junior Android Engineer', manager: 'Jane Smith', deadline: '2024-11-15', status: 'Contratado' },
    "3": { id: 3, title: 'Product Manager', manager: 'Alex Jones', deadline: '2024-07-31', status: 'Borrador' }
};

// Mock data para el flujo de entrevista
const MOCK_DATA: InterviewFlowResponse = {
    stages: [
        { id: 'new', name: 'Nuevos', color: '#3498db', order: 0 },
        { id: 'technical', name: 'Entrevista Técnica', color: '#2ecc71', order: 1 },
        { id: 'hr', name: 'Entrevista RRHH', color: '#e74c3c', order: 2 },
        { id: 'offer', name: 'Oferta', color: '#f1c40f', order: 3 }
    ],
    candidates: []
};

// Mock data para candidatos por posición
const MOCK_CANDIDATES: { [key: string]: Candidate[] } = {
    "1": [
        {
            id: '1',
            name: 'John Doe',
            current_interview_step: 'Nuevos',
            score: 2,
            status: 'new',
            applicationId: 1
        },
        {
            id: '2',
            name: 'Jane Smith',
            current_interview_step: 'Entrevista Técnica',
            score: 3,
            status: 'technical',
            applicationId: 2
        }
    ],
    "2": [
        {
            id: '3',
            name: 'Alice Johnson',
            current_interview_step: 'Entrevista RRHH',
            score: 4,
            status: 'hr',
            applicationId: 3
        }
    ],
    "3": [
        {
            id: '4',
            name: 'Bob Wilson',
            current_interview_step: 'Oferta',
            score: 5,
            status: 'offer',
            applicationId: 4
        }
    ]
};

export const api = {
    getPosition: async (positionId: string) => {
        console.log('Obteniendo detalles de la posición:', positionId);
        return MOCK_POSITIONS[positionId];
    },

    getInterviewFlow: async (positionId: string): Promise<InterviewFlowResponse> => {
        console.log('Obteniendo flujo de entrevista para posición:', positionId);
        return MOCK_DATA;
    },

    getCandidatesByPosition: async (positionId: string) => {
        console.log('Obteniendo candidatos para posición:', positionId);
        return MOCK_CANDIDATES[positionId] || [];
    },

    updateCandidateStatus: async (candidateId: string, newStatus: string): Promise<void> => {
        console.log('Actualizando estado del candidato:', { candidateId, newStatus });
        // Simulamos la actualización en los datos mock
        Object.keys(MOCK_CANDIDATES).forEach(positionId => {
            const candidates = MOCK_CANDIDATES[positionId];
            const candidate = candidates.find(c => c.id === candidateId);
            if (candidate) {
                candidate.status = newStatus;
                candidate.current_interview_step = MOCK_DATA.stages.find(s => s.id === newStatus)?.name || newStatus;
            }
        });
    }
};