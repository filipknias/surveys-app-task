import { defineMongooseModel } from '#nuxt/mongoose';
import mongoose from 'mongoose';

export const Vote = defineMongooseModel({
  name: 'Vote',
  schema: {
    ip_address: {
        type: 'string',
        required: true,
    },
    survey_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    answer_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    question_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
  },
})