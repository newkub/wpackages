import { Observable } from "../src/utils/observer";

const observable = new Observable<number>();

const unsubscribe1 = observable.subscribe((value) => {
	console.log(`Subscriber 1: ${value}`);
});

const _unsubscribe2 = observable.subscribe((value) => {
	console.log(`Subscriber 2: ${value * 2}`);
});

observable.notify(1);
observable.notify(2);
observable.notify(3);

unsubscribe1();

observable.notify(4);
