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
            return {
                surveys: surveysByName,
                pagination: {
                    currentPage,
                    pageLimit,
                    totalPages: queryTotalCount,
                },
            };
        }

        const surveys = await Survey.find().skip(offset).limit(pageLimit).exec();
        return {
            surveys,
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