export class ObjectPool<T extends { _id: number }> {
  private available: T[] = []
  private inUse: T[] = []
  private factory: () => T
  private nextId = 1

  constructor(factory: () => T) {
    this.factory = factory
  }

  public acquire(): T {
    if (this.available.length > 0) {
      const object = this.available.pop()!
      this.inUse.push(object)
      return object
    }

    const object = this.factory()
    object._id = this.nextId++
    this.inUse.push(object)
    return object
  }

  public release(object: T): void {
    const index = this.inUse.findIndex(o => o._id === object._id)
    if (index !== -1) {
      this.inUse.splice(index, 1)
      this.available.push(object)
    }
  }

  public getAvailableCount(): number {
    return this.available.length
  }

  public getInUseCount(): number {
    return this.inUse.length
  }
}
