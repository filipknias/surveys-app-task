export default defineEventHandler(async (event) => {
    try {
        const { page, per_page, name } = getQuery(event);
        const currentPage = page || 1;
        const pageLimit = per_page || 1;
        const offset = (currentPage as number - 1) * (pageLimit as number);

        const totalCount = await Survey.countDocuments().exec();
        const totalPages = Math.ceil(totalCount / (pageLimit as number));

        if (name) {
            const surveysByName = await Survey.find({ name }).exec();
            return surveysByName;
        }

        const surveys = await Survey.find().skip(offset).limit(pageLimit as number).exec();
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