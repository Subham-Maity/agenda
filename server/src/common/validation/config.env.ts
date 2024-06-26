import * as Joi from 'joi';

export const validateConfig = Joi.object({
    DATABASE_URL: Joi.string().uri().required(),
    PORT: Joi.number().required(),
});
