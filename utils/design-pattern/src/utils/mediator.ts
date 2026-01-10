export type MediatorCallback = (message: string) => void;

export class Mediator {
	private participants = new Map<string, MediatorCallback>();

	register(name: string, callback: MediatorCallback): void {
		this.participants.set(name, callback);
	}

	send(from: string, to: string, message: string): void {
		const recipient = this.participants.get(to);
		if (recipient) {
			recipient(`[${from}] ${message}`);
		}
	}

	broadcast(from: string, message: string): void {
		this.participants.forEach((callback, name) => {
			if (name !== from) {
				callback(`[${from}] ${message}`);
			}
		});
	}
}

export function mediator(): Mediator {
	return new Mediator();
}
