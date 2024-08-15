import IP from "ip";

export default defineEventHandler(async (event) => {
    try {
        const surveyId = getRouterParam(event, 'surveyId');
        const body = await readBody(event);
        const ipAddress = IP.address();

        const votesWithIp = await Vote.find({ survey_id: surveyId, ip_address: ipAddress });

        if (votesWithIp.length > 0) {
            return createError({
                statusCode: 403,
                statusMessage: 'This survey is arleady submitted.'
            });
        }

        if (body.questions.length > body.answers.length) {
            return createError({
                statusCode: 400,
                statusMessage: 'Please select all answers.'
            });
        }
       
        body.answers.forEach(async (answer: { questionId: string, name: string, answerId: string }) => {
            const newVote = new Vote({ 
                answer_id: answer.answerId,
                question_id: answer.questionId,
                survey_id: surveyId,
                ip_address: ipAddress,
            });
            await newVote.save();
        });
    } catch (err) {
        console.error(err);
    }
});