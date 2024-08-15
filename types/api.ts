type Pagination = {
    currentPage: number,
    pageLimit: number,
    totalPages: number,
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
}

export type VotesCountGetRequest = {
    votes: {
        surveyId: string;
        votesCount: number;
    }[];
}