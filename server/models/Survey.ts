import { defineMongooseModel } from '#nuxt/mongoose'

export const Survey = defineMongooseModel({
  name: 'Survey',
  schema: {
    name: {
      type: 'string',
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
  timestamps: true,
})