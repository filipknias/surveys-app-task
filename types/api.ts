type Pagination = {
    currentPage: number,
    pageLimit: number,
    totalPages: number,
}

export type SurveysPostRequest = {
    id: string;
}

export type SurveysGetRequest = {
   surveys: Survey[];
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
    answers: { id: string; name: string }[];
    closed_at: Date|null;
    status: string;
}