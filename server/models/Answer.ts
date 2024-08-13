import { defineMongooseModel } from '#nuxt/mongoose';
import mongoose from 'mongoose';

export const Answer = defineMongooseModel({
  name: 'Answer',
  schema: {
    name: {
      type: 'string',
      required: true,
    },
    survey_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    question_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
  },
})