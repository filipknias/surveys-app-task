import { Answer } from "~/server/models/Answer";
import { Question } from "~/server/models/Question";
import type { Question as QuestionType, QuestionAnswer } from "~/types/api";

export default defineEventHandler(async (event) => {
    try {
        const { name, questions } = await readBody(event);

        const newSurvey = new Survey({ name });
        await newSurvey.save();

        questions.forEach(async (question: QuestionType) => {
            const newQuestion = new Question({ 
                name: question.name, 
                survey_id: newSurvey._id 
            });
            await newQuestion.save();

            question.answers.forEach(async (answer: QuestionAnswer) => {
                const newAnswer = new Answer({ 
                    name: answer.name,
                    survey_id: newSurvey._id,
                    question_id: newQuestion._id,
                });
                await newAnswer.save();
            })
        });

        return { id: newSurvey._id };
    } catch (err) {
        console.error(err);
    }
});