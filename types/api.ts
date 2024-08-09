type RequestStatus = "success" | "fail";

export type SurveysPostRequest = {
    status: RequestStatus;
    id: string;
}