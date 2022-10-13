import Joi from 'joi';

const incentivePaySchema = Joi.object({
  data: Joi.object({
    ehCt: Joi.any(),
    epCt: Joi.any(),
    ehAmt: Joi.object().pattern(
      /\d{4}/,
      Joi.object().pattern(
        /[1-4]{1}/,
        Joi.number().integer().positive().allow(0).required().messages({
          'number.base':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."',
          'number.empty':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."',
          'number.integer':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."',
          'number.format':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."',
          'number.positive':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."'
        })
      )
    ),
    epAmt: Joi.object().pattern(
      /\d{4}/,
      Joi.object().pattern(
        /[1-4]{1}/,
        Joi.number().integer().positive().allow(0).required().messages({
          'number.base':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."',
          'number.empty':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."',
          'number.integer':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."',
          'number.format':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."',
          'number.positive':
            'Provide a whole number greater than or equal to $0. Decimals will be rounded to the closest number."'
        })
      )
    )
  })
});

export default incentivePaySchema;