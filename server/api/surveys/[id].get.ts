import { Answer } from "~/server/models/Answer";
import { Question } from "~/server/models/Question";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');

        const survey = await Survey.findById(id).exec();
        const questions = await Question.find({ survey_id: id }).exec();

        const answersPromise = questions.map(async (question) => {
            const answers = await Answer.find({ question_id: question._id }).exec();
            const formattedAnswers = answers.map(({ _id, name }) => ({ id: _id, name }));
            return {
                id: question._id,
                name: question.name,
                answers: formattedAnswers,
            }
        });

        const questionsWithAnswers = await Promise.all(answersPromise);

        return {
            survey,
            questions: questionsWithAnswers,
        };
    } catch (err) {
        console.error(err);
    }
});