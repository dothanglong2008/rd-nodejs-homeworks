const joi = require('joi');

exports.validateRegisterRequest = async (req, res, next) => {
  try {
    const requestBody = await req.body;

    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
      role: joi.string().valid('SHIPPER', 'DRIVER').required(),
    });

    const result = schema.validate(requestBody);
    if (result.error) {
      return res.status(400).json({
        message: result.error.message,
      });
    };
    next();
  } catch (err) {
    next(err);
  }
};

exports.validateLoginRequest = async (req, res, next) => {
  try {
    const requestBody = await req.body;

    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });

    const result = schema.validate(requestBody);
    if (result.error) {
      return res.status(400).json({
        message: result.error.message,
      });
    };
    next();
  } catch (err) {
    next(err);
  }
};

exports.validateAddTruckRequest = async (req, res, next) => {
  try {
    const requestBody = await req.body;

    const schema = joi.object({
      type: joi.string().valid('SPRINTER',
          'SMALL STRAIGHT',
          'LARGE STRAIGHT').required(),
    });

    const result = schema.validate(requestBody);
    if (result.error) {
      return res.status(400).json({
        message: result.error.message,
      });
    };
    next();
  } catch (err) {
    next(err);
  }
};

exports.validateUpdateTruckRequest = async (req, res, next) => {
  try {
    const requestBody = await req.body;

    const schema = joi.object({
      type: joi.string().valid('SPRINTER',
          'SMALL STRAIGHT',
          'LARGE STRAIGHT'),
    });

    const result = schema.validate(requestBody);
    if (result.error) {
      return res.status(400).json({
        message: result.error.message,
      });
    };
    next();
  } catch (err) {
    next(err);
  }
};

exports.validateViewLoadRequest = async (req, res, next) => {
  try {
    const requestQuery = await req.query;

    const schema = joi.object({
      status: joi.string().valid('NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'),
      limit: joi.number().max(50),
      offset: joi.number(),
    });

    const result = schema.validate(requestQuery);
    if (result.error) {
      return res.status(400).json({
        message: result.error.message,
      });
    };
    next();
  } catch (err) {
    next(err);
  }
};


