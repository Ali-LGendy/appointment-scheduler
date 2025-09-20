import Joi from "joi";

export default function validate(schema, property = 'body') {
    return (req, res, next) => {
        const opitions = {
            abortEarly: false,  
            allowUnknown: false,
            stripUnknown: true, 
        };

        const { error, value} = schema.validate(req[property], opitions);

        if(error) {
            const details = error.details.map( d => ({
                message: d.message,
                path: d.path.join('.'),
                type: d.type,
            }));

            return res.status(400).json({ success: false, errors: details });
        }

        req[property] = value;
        next();
    };
}