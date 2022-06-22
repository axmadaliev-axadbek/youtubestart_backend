import Joi from 'joi'

export const loginShema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

export const registerSchema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(8).required(),
})

export const videoSchemaPut = Joi.object({
    body: Joi.object({
        title: Joi.string().required().max(40)
    }),
    params: Joi.object({
        videoId: Joi.number().required()
    })
})