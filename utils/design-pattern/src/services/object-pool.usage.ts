import { ObjectPool } from './object-pool'

console.log('--- Object Pool ---')
class MyPoolObject {
  _id = 0
  value: string
  constructor(value: string) {
    this.value = value
  }
}
const pool = new ObjectPool(() => new MyPoolObject('default'))
const obj1 = pool.acquire()
console.log(
  `Acquired object 1. In use: ${pool.getInUseCount()}, Available: ${pool.getAvailableCount()}`
)
pool.acquire()
console.log(
  `Acquired object 2. In use: ${pool.getInUseCount()}, Available: ${pool.getAvailableCount()}`
)
pool.release(obj1)
console.log(
  `Released object 1. In use: ${pool.getInUseCount()}, Available: ${pool.getAvailableCount()}`
)
const obj3 = pool.acquire()
console.log(
  `Acquired object 3. In use: ${pool.getInUseCount()}, Available: ${pool.getAvailableCount()}`
)
console.log('Object 1 and 3 should be the same instance:', obj1 === obj3)
