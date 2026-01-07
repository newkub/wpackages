import {
  DogHandler,
  MonkeyHandler,
  SquirrelHandler
} from './chain-of-responsibility'

console.log('--- Chain of Responsibility ---')
const monkey = new MonkeyHandler()
const squirrel = new SquirrelHandler()
const dog = new DogHandler()
monkey.setNext(squirrel).setNext(dog)
const foods = ['Nut', 'Banana', 'Cup of coffee', 'MeatBall']
for (const food of foods) {
  console.log(`Client: Who wants a ${food}?`)
  const result = monkey.handle(food)
  if (result) {
    console.log(`  ${result}`)
  } else {
    console.log(`  ${food} was left untouched.`)
  }
}
