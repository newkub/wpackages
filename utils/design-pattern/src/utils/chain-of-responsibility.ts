export interface Handler {
	handle(request: string): string | null;
	setNext(handler: Handler): Handler;
}

export abstract class BaseHandler implements Handler {
	private next: Handler | null = null;

	setNext(handler: Handler): Handler {
		this.next = handler;
		return handler;
	}

	handle(request: string): string | null {
		if (this.next) {
			return this.next.handle(request);
		}
		return null;
	}
}

export function chain(handlers: Handler[]): Handler {
	if (handlers.length === 0) {
		return new NullHandler();
	}
	for (let i = 0; i < handlers.length - 1; i++) {
		const current = handlers[i];
		const next = handlers[i + 1];
		if (current && next) {
			current.setNext(next);
		}
	}
	return handlers[0]!;
}

class NullHandler extends BaseHandler {
	override handle(_request: string): string | null {
		return null;
	}
}
