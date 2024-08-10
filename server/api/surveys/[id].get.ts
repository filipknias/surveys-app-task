export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id');

        const surveyById = await Survey.findById(id).exec();

        return surveyById;
    } catch (err) {
        console.error(err);
    }
});