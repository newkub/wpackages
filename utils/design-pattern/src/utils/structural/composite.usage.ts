import { Composite, Leaf } from './composite'

console.log('--- Composite ---')
const tree = new Composite()
const branch1 = new Composite()
branch1.add(new Leaf())
branch1.add(new Leaf())
const branch2 = new Composite()
branch2.add(new Leaf())
tree.add(branch1)
tree.add(branch2)
console.log(`Result: ${tree.operation()}`)
