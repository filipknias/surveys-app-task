export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        const newSurvey = new Survey({ 
            name: body.name, 
            answers: body.answers 
        });
        await newSurvey.save();

        return { 
            status: "success",
            id: newSurvey._id, 
        }
    } catch (err) {
        console.error(err);
    }
});