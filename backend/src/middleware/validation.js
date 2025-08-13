const Joi = require('joi');

// Strategy validation schema
const strategySchema = Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().required().min(10).max(500),
    protocol: Joi.string().required(),
    contractAddress: Joi.string().required(),
    apy: Joi.number().required().min(0).max(100),
    riskLevel: Joi.number().required().min(1).max(5),
    category: Joi.string().required(),
    minimumDeposit: Joi.number().min(0).default(0)
});

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        req.body = value;
        next();
    };
};

module.exports = {
    validateStrategy: validate(strategySchema),
    validateStrategyQuery: (req, res, next) => next() // Placeholder
};