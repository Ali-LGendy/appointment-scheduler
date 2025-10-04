import Joi from "joi";

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    name: Joi.string().min(1).max(128).required(),
    role: Joi.string().valid('user', 'provider', 'admin').default('user'),
    service_type: Joi.string().allow(null, '')
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required()
});