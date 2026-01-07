import { FlyweightFactory } from './flyweight'

console.log('--- Flyweight ---')
const factory = new FlyweightFactory([
  ['Chevrolet', 'Camaro2018', 'pink'],
  ['Mercedes Benz', 'C300', 'black'],
  ['Mercedes Benz', 'C500', 'red'],
  ['BMW', 'M5', 'red'],
  ['BMW', 'X6', 'white']
])
factory.listFlyweights()

const addCarToPoliceDatabase = (
  ff: FlyweightFactory,
  plates: string,
  owner: string,
  brand: string,
  model: string,
  color: string
) => {
  console.log('\nClient: Adding a car to police database.')
  const flyweight = ff.getFlyweight([brand, model, color])
  flyweight.operation([plates, owner])
}

addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'M5', 'red')
addCarToPoliceDatabase(factory, 'CL234IR', 'James Doe', 'BMW', 'X1', 'red')
factory.listFlyweights()
