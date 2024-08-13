import { defineMongooseModel } from '#nuxt/mongoose';
import mongoose from 'mongoose';

export const Question = defineMongooseModel({
  name: 'Question',
  schema: {
    name: {
      type: 'string',
      required: true,
    },
    survey_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
  },
})