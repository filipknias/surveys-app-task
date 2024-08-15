type Pagination = {
    currentPage: number,
    pageLimit: number,
    totalPages: number,
}

type Summary = {
    id: string;
    question: string;
    votes: {
        id: string;
        name: string;
        votesCount: number;
    }[];
}

export type SurveysPostRequest = {
    id: string;
}

export type SurveysGetRequest = {
   surveys: ({ votesCount: number } & Survey)[];
   pagination: Pagination;
}

export type RequestFail = {
    url: string;
    statusCode: number;
    statusMessage: string;
    message: string;
    stack: string; 
    data: {
        path: string;
    };
}

export type Survey = {
    _id: string;
    name: string;
    closed_at: Date|null;
    status: string;
    created_at: Date|null;
}

export type QuestionAnswer = {
    id: string, 
    name: string,
}

export type Question = {
    id: string;
    name: string,
    answers: QuestionAnswer[],
}

export type SurveyIdGetRequest = {
    survey: Survey;
    questions: Question[];
    summary: Summary;
    totalVotes: number;
}

export type VotesCountGetRequest = {
    votes: {
        surveyId: string;
        votesCount: number;
    }[];
}