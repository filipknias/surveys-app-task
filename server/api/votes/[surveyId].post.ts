import IP from "ip";

export default defineEventHandler(async (event) => {
    try {
        const surveyId = getRouterParam(event, 'surveyId');
        const body = await readBody(event);
        const ipAddress = IP.address();

        const votesWithIp = await Vote.find({ survey_id: surveyId, ip_address: ipAddress });

        if (votesWithIp.length > 0) {
            // return new Error('This survey is arleady submitted.');
            return createError({
                statusCode: 403,
                statusMessage: 'This survey is arleady submitted.'
            });
        }

        body.answers.forEach(async (answer: { id: string, value: string, name: string }) => {
            const newVote = new Vote({ 
                answers: answer.value,
                survey_id: surveyId,
                ip_address: ipAddress,
            });
            await newVote.save();
        });

        

        return { status: "OK" };
    } catch (err) {
        console.error(err);
    }
});