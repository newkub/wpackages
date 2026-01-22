import { boolean } from '../src/utils/validators/boolean.ts'
import { array } from '../src/utils/validators/collection.ts'
import { numeric } from '../src/utils/validators/numeric.ts'
import { stringNonEmpty } from '../src/utils/validators/string.ts'
import { integer as integerValidator } from '../src/utils/validators/numeric.ts'
import { hasKey } from '../src/utils/validators/object.ts'
import { z } from 'zod'
import * as yup from 'yup'
import Joi from 'joi'
import { type } from 'arktype'

// Sample data for benchmarking
export const sampleData = {
  boolean: true,
  array: [1, 2, 3, 4, 5],
  collection: [1, 2, 3, 4, 5],
  numeric: '42',
  string: 'hello world',
  integer: 42,
  object: { name: 'test', value: 123 },
}

// Create validator functions
export const validators = {
  boolean: boolean(),
  array: array(),
  collection: array(),
  numeric: numeric(),
  string: stringNonEmpty(),
  integer: integerValidator(),
  object: hasKey('name'),
}

// Zod validators
export const zodValidators = {
  boolean: z.boolean(),
  array: z.array(z.number()),
  collection: z.array(z.number()),
  numeric: z.number().or(z.string()),
  string: z.string().min(1),
  integer: z.number().int(),
  object: z.object({ name: z.string() }),
}

// Yup validators
export const yupValidators = {
  boolean: yup.boolean(),
  array: yup.array().of(yup.number()),
  collection: yup.array().of(yup.number()),
  numeric: yup.number(),
  string: yup.string().required(),
  integer: yup.number().integer(),
  object: yup.object().shape({ name: yup.string().required() }),
}

// Joi validators
export const joiValidators = {
  boolean: Joi.boolean(),
  array: Joi.array().items(Joi.number()),
  collection: Joi.array().items(Joi.number()),
  numeric: Joi.number(),
  string: Joi.string().min(1),
  integer: Joi.number().integer(),
  object: Joi.object({ name: Joi.string().required() }),
}

// Arktype validators
export const arktypeValidators = {
  boolean: type('boolean'),
  array: type('number[]'),
  collection: type('number[]'),
  numeric: type('number | string'),
  string: type('string'),
  integer: type('number'),
  object: type({ name: 'string' }),
}
