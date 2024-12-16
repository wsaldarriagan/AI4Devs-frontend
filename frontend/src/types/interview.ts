export interface Candidate {
    id: string;
    name: string;
    current_interview_step: string;
    score: number;
    status: string;
    applicationId: number;
}

export interface InterviewStage {
    id: string;
    name: string;
    color: string;
    order: number;
}

export interface InterviewFlowResponse {
    stages: InterviewStage[];
    candidates: Candidate[];
}

export interface KanbanColumn {
    id: string;
    title: string;
    color: string;
    candidates: Candidate[];
}