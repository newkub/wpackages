import { ConcreteBuilder1, Director } from './builder'

console.log('--- Builder ---')
const director = new Director()
const builder = new ConcreteBuilder1()
director.setBuilder(builder)

console.log('Standard basic product:')
director.buildMinimalViableProduct()
builder.getProduct().listParts()

console.log('Standard full featured product:')
director.buildFullFeaturedProduct()
builder.getProduct().listParts()

console.log('Custom product:')
builder.producePartA()
builder.producePartC()
builder.getProduct().listParts()
