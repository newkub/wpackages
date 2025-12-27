export type Ok<T> = { success: true; value: T };
export type Err<E> = { success: false; error: E };
export type Result<T, E> = Ok<T> | Err<E>;