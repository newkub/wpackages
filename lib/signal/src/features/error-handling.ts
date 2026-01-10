import { AppError } from "@wpackages/error";
import type { Effect } from "../types/effect.type";
import type { Accessor, Setter, Signal } from "../types/ref.type";

export class SignalError extends AppError {
	constructor(readonly signalName: string, readonly cause: unknown) {
		super({
			message: `Signal ${signalName} error`,
			statusCode: 500,
			isOperational: true,
			cause,
		});
	}
}

export class EffectError extends AppError {
	constructor(readonly effectName: string, readonly cause: unknown) {
		super({
			message: `Effect ${effectName} error`,
			statusCode: 500,
			isOperational: true,
			cause,
		});
	}
}

export interface SignalErrorHandler<T> {
	(error: SignalError, signal: Accessor<T>, value: T): void;
}

export interface EffectErrorHandler {
	(error: EffectError, effect: Effect): void;
}

let globalSignalErrorHandler: SignalErrorHandler<unknown> | null = null;
let globalEffectErrorHandler: EffectErrorHandler | null = null;

export const setGlobalSignalErrorHandler = <T>(
	handler: SignalErrorHandler<T>,
): void => {
	globalSignalErrorHandler = handler as SignalErrorHandler<unknown>;
};

export const setGlobalEffectErrorHandler = (
	handler: EffectErrorHandler,
): void => {
	globalEffectErrorHandler = handler;
};

export const handleSignalError = <T>(
	signalName: string,
	signal: Accessor<T>,
	value: T,
	cause: unknown,
): void => {
	const error = new SignalError(signalName, cause);

	if (globalSignalErrorHandler) {
		globalSignalErrorHandler(error, signal, value);
	} else {
		console.error("Signal error:", error);
	}
};

export const handleEffectError = (
	effectName: string,
	effect: Effect,
	cause: unknown,
): void => {
	const error = new EffectError(effectName, cause);

	if (globalEffectErrorHandler) {
		globalEffectErrorHandler(error, effect);
	} else {
		console.error("Effect error:", error);
	}
};

export const createSignalWithErrorHandling = <T>(
	signalName: string,
	initialValue: T,
): Signal<T> => {
	const [get, set] = createSignal(initialValue);

	const safeSet: Setter<T> = (value) => {
		try {
			return set(value);
		} catch (error) {
			handleSignalError(signalName, get, value, error);
			throw error;
		}
	};

	return [get, safeSet];
};

export const withErrorHandling = <T>(
	signal: Signal<T>,
	signalName: string,
): Signal<T> => {
	const [get, set] = signal;

	const safeSet: Setter<T> = (value) => {
		try {
			return set(value);
		} catch (error) {
			handleSignalError(signalName, get, value, error);
			throw error;
		}
	};

	return [get, safeSet];
};

export const createEffectWithErrorHandling = (
	effectName: string,
	effect: Effect,
): Effect => {
	return (() => {
		try {
			effect();
		} catch (error) {
			handleEffectError(effectName, effect, error);
			throw error;
		}
	}) as Effect;
};
