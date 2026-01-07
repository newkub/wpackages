class Flyweight {
  private sharedState: any

  constructor(sharedState: any) {
    this.sharedState = sharedState
  }

  public operation(uniqueState: any): void {
    const s = JSON.stringify(this.sharedState)
    const u = JSON.stringify(uniqueState)
    console.log(`Flyweight: Displaying shared (${s}) and unique (${u}) state.`)
  }
}

export class FlyweightFactory {
  private flyweights: { [key: string]: Flyweight } = <any> {}

  constructor(initialFlyweights: string[][]) {
    for (const state of initialFlyweights) {
      this.flyweights[this.getKey(state)] = new Flyweight(state)
    }
  }

  private getKey(state: string[]): string {
    return state.join('_')
  }

  public getFlyweight(sharedState: string[]): Flyweight {
    const key = this.getKey(sharedState)

    if (!(key in this.flyweights)) {
      console.log("FlyweightFactory: Can't find a flyweight, creating new one.")
      this.flyweights[key] = new Flyweight(sharedState)
    }

    return this.flyweights[key]
  }

  public listFlyweights(): void {
    const count = Object.keys(this.flyweights).length
    console.log(`\nFlyweightFactory: I have ${count} flyweights:`)
    for (const key in this.flyweights) {
      console.log(key)
    }
  }
}
