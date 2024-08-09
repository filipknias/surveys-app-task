export type SurveysPostRequest = {
    id: string;
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