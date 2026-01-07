import { Proxy } from './proxy'

console.log('--- Proxy ---')
class RealSubject {
  public request(): void {
    console.log('RealSubject: Handling request.')
  }
}
const realSubject = new RealSubject()
const proxy = new Proxy(realSubject as any)
proxy.request()
