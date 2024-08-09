export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        const newSurvey = new Survey({ 
            name: body.name, 
            answers: body.answers 
        });
        await newSurvey.save();

        return { id: newSurvey._id };
    } catch (err) {
        console.error(err);
    }
});