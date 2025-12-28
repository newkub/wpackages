export type ResultType<E, A> =
	| { readonly _tag: "Failure"; readonly error: E }
	| { readonly _tag: "Success"; readonly value: A };

export type Result<E, A> = ResultType<E, A>;

export const ok = <E, A>(value: A): ResultType<E, A> => ({
	_tag: "Success",
	value,
});

export const err = <E, A>(error: E): ResultType<E, A> => ({
	_tag: "Failure",
	error,
});

export const isSuccess = <E, A>(result: ResultType<E, A>): result is { readonly _tag: "Success"; readonly value: A } =>
	result._tag === "Success";

export const isFailure = <E, A>(result: ResultType<E, A>): result is { readonly _tag: "Failure"; readonly error: E } =>
	result._tag === "Failure";

export const isOk = isSuccess;

export const isErr = isFailure;

export const map = <E, A, B>(result: ResultType<E, A>, fn: (value: A) => B): ResultType<E, B> => {
	if (isSuccess(result)) return ok<E, B>(fn(result.value));
	return result;
};

export const mapErr = <E, A, F>(result: ResultType<E, A>, fn: (error: E) => F): ResultType<F, A> => {
	if (isFailure(result)) return err<F, A>(fn(result.error));
	return result;
};

export const chain = <E, A, B>(result: ResultType<E, A>, fn: (value: A) => ResultType<E, B>): ResultType<E, B> => {
	if (isSuccess(result)) return fn(result.value);
	return result;
};

export const unwrap = <E, A>(result: ResultType<E, A>): A => {
	if (isSuccess(result)) return result.value;
	throw result.error;
};

export const unwrapOr = <E, A>(result: ResultType<E, A>, defaultValue: A): A =>
	isSuccess(result) ? result.value : defaultValue;
