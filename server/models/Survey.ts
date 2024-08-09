import { defineMongooseModel } from '#nuxt/mongoose'

export const Survey = defineMongooseModel({
  name: 'Survey',
  schema: {
    name: {
      type: 'string',
      required: true,
    },
    answers: {
        type: Array,
        required: true,
    },
    closed_at: {
        type: Date,
        default: null,
    },
    status: {
        type: 'string',
        required: true,
        default: 'active',
    }
  },
})