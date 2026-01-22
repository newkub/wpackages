import { sampleData, validators, zodValidators, yupValidators, joiValidators, arktypeValidators } from './sample.ts'

// Benchmark configuration
const ITERATIONS = 100000

function benchmark(name: string, fn: () => void) {
  const start = performance.now()
  for (let i = 0; i < ITERATIONS; i++) {
    fn()
  }
  const end = performance.now()
  const duration = end - start
  const opsPerSec = (ITERATIONS / duration) * 1000

  return {
    name,
    duration,
    opsPerSec,
    iterations: ITERATIONS,
  }
}

function runBenchmarks() {
  const results = []

  // Our validators
  results.push(
    benchmark('our-boolean', () => {
      validators.boolean(sampleData.boolean)
    })
  )

  results.push(
    benchmark('our-array', () => {
      validators.array(sampleData.array)
    })
  )

  results.push(
    benchmark('our-collection', () => {
      validators.collection(sampleData.collection)
    })
  )

  results.push(
    benchmark('our-numeric', () => {
      validators.numeric(sampleData.numeric)
    })
  )

  results.push(
    benchmark('our-string', () => {
      validators.string(sampleData.string)
    })
  )

  results.push(
    benchmark('our-integer', () => {
      validators.integer(sampleData.integer)
    })
  )

  results.push(
    benchmark('our-object', () => {
      validators.object(sampleData.object)
    })
  )

  // Zod validators
  results.push(
    benchmark('zod-boolean', () => {
      zodValidators.boolean.parse(sampleData.boolean)
    })
  )

  results.push(
    benchmark('zod-array', () => {
      zodValidators.array.parse(sampleData.array)
    })
  )

  results.push(
    benchmark('zod-collection', () => {
      zodValidators.collection.parse(sampleData.collection)
    })
  )

  results.push(
    benchmark('zod-numeric', () => {
      zodValidators.numeric.parse(sampleData.numeric)
    })
  )

  results.push(
    benchmark('zod-string', () => {
      zodValidators.string.parse(sampleData.string)
    })
  )

  results.push(
    benchmark('zod-integer', () => {
      zodValidators.integer.parse(sampleData.integer)
    })
  )

  results.push(
    benchmark('zod-object', () => {
      zodValidators.object.parse(sampleData.object)
    })
  )

  // Yup validators
  results.push(
    benchmark('yup-boolean', () => {
      yupValidators.boolean.validateSync(sampleData.boolean)
    })
  )

  results.push(
    benchmark('yup-array', () => {
      yupValidators.array.validateSync(sampleData.array)
    })
  )

  results.push(
    benchmark('yup-collection', () => {
      yupValidators.collection.validateSync(sampleData.collection)
    })
  )

  results.push(
    benchmark('yup-numeric', () => {
      yupValidators.numeric.validateSync(sampleData.numeric)
    })
  )

  results.push(
    benchmark('yup-string', () => {
      yupValidators.string.validateSync(sampleData.string)
    })
  )

  results.push(
    benchmark('yup-integer', () => {
      yupValidators.integer.validateSync(sampleData.integer)
    })
  )

  results.push(
    benchmark('yup-object', () => {
      yupValidators.object.validateSync(sampleData.object)
    })
  )

  // Joi validators
  results.push(
    benchmark('joi-boolean', () => {
      joiValidators.boolean.validate(sampleData.boolean)
    })
  )

  results.push(
    benchmark('joi-array', () => {
      joiValidators.array.validate(sampleData.array)
    })
  )

  results.push(
    benchmark('joi-collection', () => {
      joiValidators.collection.validate(sampleData.collection)
    })
  )

  results.push(
    benchmark('joi-numeric', () => {
      joiValidators.numeric.validate(sampleData.numeric)
    })
  )

  results.push(
    benchmark('joi-string', () => {
      joiValidators.string.validate(sampleData.string)
    })
  )

  results.push(
    benchmark('joi-integer', () => {
      joiValidators.integer.validate(sampleData.integer)
    })
  )

  results.push(
    benchmark('joi-object', () => {
      joiValidators.object.validate(sampleData.object)
    })
  )

  // Arktype validators
  results.push(
    benchmark('arktype-boolean', () => {
      arktypeValidators.boolean(sampleData.boolean)
    })
  )

  results.push(
    benchmark('arktype-array', () => {
      arktypeValidators.array(sampleData.array)
    })
  )

  results.push(
    benchmark('arktype-collection', () => {
      arktypeValidators.collection(sampleData.collection)
    })
  )

  results.push(
    benchmark('arktype-numeric', () => {
      arktypeValidators.numeric(sampleData.numeric)
    })
  )

  results.push(
    benchmark('arktype-string', () => {
      arktypeValidators.string(sampleData.string)
    })
  )

  results.push(
    benchmark('arktype-integer', () => {
      arktypeValidators.integer(sampleData.integer)
    })
  )

  results.push(
    benchmark('arktype-object', () => {
      arktypeValidators.object(sampleData.object)
    })
  )

  // Sort by ops per second (descending)
  results.sort((a, b) => b.opsPerSec - a.opsPerSec)

  return results
}

const results = runBenchmarks()

// Print results
console.log('Benchmark Results:')
console.log('==================')
results.forEach((result, index) => {
  console.log(
    `${index + 1}. ${result.name}: ${result.opsPerSec.toFixed(2)} ops/sec (${result.duration.toFixed(2)}ms for ${result.iterations} iterations)`
  )
})

// Save results to JSON
const resultJson = {
  timestamp: new Date().toISOString(),
  iterations: ITERATIONS,
  results,
}

await Bun.write('./bench/result.json', JSON.stringify(resultJson, null, 2))

console.log('\nResults saved to bench/result.json')
