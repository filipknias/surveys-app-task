async function getUniqueVotes(surveyId: string) {
    const uniqueVotes = await Vote.find({ survey_id: surveyId }).distinct('ip_address');
    return uniqueVotes.length
}

export default defineEventHandler(async (event) => {
    try {
        const { page, per_page, name } = getQuery(event);
        const currentPage = page || 1;
        const pageLimit = (per_page || 1) as number;
        const offset = (currentPage as number - 1) * pageLimit;

        const totalCount = await Survey.countDocuments().exec();
        const totalPages = Math.ceil(totalCount / pageLimit);

        if (name) {
            const nameRegExp = new RegExp(name as string, 'i');
            const queryTotalCount = await Survey.countDocuments({ name: nameRegExp }).exec()
            const surveysByName = await Survey.find({ name: nameRegExp }).skip(offset).limit(pageLimit).exec();

            const surveysPromise = surveysByName.map(async (survey) => {
                return {
                    _id: survey._id,
                    name: survey.name,
                    closed_at: survey.closed_at,
                    status: survey.status,
                    votesCount: await getUniqueVotes(survey.id),
                }
            });
            const surveysWithVotes = await Promise.all(surveysPromise);

            return {
                surveys: surveysWithVotes,
                pagination: {
                    currentPage,
                    pageLimit,
                    totalPages: queryTotalCount,
                },
            };
        }

        const surveys = await Survey.find().skip(offset).limit(pageLimit).exec();
        const surveysPromise = surveys.map(async (survey) => {
            return {
                _id: survey._id,
                name: survey.name,
                closed_at: survey.closed_at,
                status: survey.status,
                votesCount: await getUniqueVotes(survey.id),
            }
        });

        const surveysWithVotes = await Promise.all(surveysPromise);

        return {
            surveys: surveysWithVotes,
            pagination: {
                currentPage,
                pageLimit,
                totalPages,
            },
        };
    } catch (err) {
        console.error(err);
    }
});