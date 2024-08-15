import { nanoid } from 'nanoid';

export const PER_PAGE = 3;
export const TIMER_INTERVAL = 60000;
export const INITIAL_QUESTIONS = [
    { 
        id: nanoid(), 
        name: "",
        answers: [{ id: nanoid(), name: "" }],
    },
    { 
        id: nanoid(), 
        name: "",
        answers: [{ id: nanoid(), name: "" }],
    },
    { 
        id: nanoid(), 
        name: "",
        answers: [{ id: nanoid(), name: "" }],
    },
]