import { Singleton } from './singleton'

console.log('--- Singleton ---')
const s1 = Singleton.getInstance()
const s2 = Singleton.getInstance()
console.log(
  'Singleton works, both variables contain the same instance.',
  s1 === s2
)
