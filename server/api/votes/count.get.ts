export default defineEventHandler(async (event) => {
    try {
        const surveys = await Survey.find().exec();
        
        const votesPromise = surveys.map(async (survey) => {
            const uniqueVotes = await Vote.find({ survey_id: survey._id }).distinct('ip_address');
            return {
                surveyId: survey._id,
                votesCount: uniqueVotes.length,
            };
        });

        const uniqueVotes = await Promise.all(votesPromise);
        return { votes: uniqueVotes };
    } catch (err) {
        console.error(err);
    }
});