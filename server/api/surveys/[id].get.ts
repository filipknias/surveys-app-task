import { Answer } from "~/server/models/Answer";
import { Question } from "~/server/models/Question";

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');

        const survey = await Survey.findById(id).exec();
        const questions = await Question.find({ survey_id: id }).exec();

        const answersPromise = questions.map(async (question: any) => {
            const answers = await Answer.find({ question_id: question._id }).exec();
            const formattedAnswers = answers.map(({ _id, name }) => ({ id: _id, name }));
            return {
                id: question._id,
                name: question.name,
                answers: formattedAnswers,
            }
        });

        const questionsWithAnswers = await Promise.all(answersPromise);

        const summaryPromise = questionsWithAnswers.map(async (question) => {
            const votesPromise = question.answers.map(async (answer) => {
                const votesCount = await Vote.countDocuments({ 
                    survey_id: id, 
                    question_id: question.id, 
                    answer_id: answer.id 
                }).exec();
                return {
                    id: answer.id,
                    name: answer.name,
                    votesCount,
                }
            });
            
            return {
                id: question.id,
                question: question.name,
                votes: await Promise.all(votesPromise),
            };
        });

        const summary = await Promise.all(summaryPromise);
        const totalVotes = summary.reduce((acc, votes) => {
            const questionVotes = votes.votes.reduce((acc, answerVotes) => acc + answerVotes.votesCount, 0);
            return acc + questionVotes;
        }, 0);

        return {
            survey,
            questions: questionsWithAnswers,
            summary,
            totalVotes,
        };
    } catch (err) {
        console.error(err);
    }
});