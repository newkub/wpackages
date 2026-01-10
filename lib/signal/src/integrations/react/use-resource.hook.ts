import { useEffect, useRef, useState } from "react";
import { createResource as createCoreResource } from "../../services/resource.service";
import type { Resource } from "../../types";

export function useResource<T>(
	source: () => Promise<T> | T,
	initialValue?: T,
): Resource<T> {
	const resourceRef = useRef<Resource<T>>();

	if (!resourceRef.current) {
		resourceRef.current = createCoreResource(source, initialValue);
	}

	const [data, { loading, error }] = resourceRef.current;
	const [, setForceUpdate] = useState({});

	useEffect(() => {
		const effect = () => {
			data();
			loading();
			error();
			setForceUpdate({});
		};

		effect();

		return () => {};
	}, [data, loading, error]);

	return resourceRef.current;
}

export function useResourceValue<T>(resource: Resource<T>): T | undefined {
	const [data] = resource;
	const valueRef = useRef<T | undefined>(data());

	useEffect(() => {
		valueRef.current = data();
	}, [data]);

	return valueRef.current;
}

export function useResourceLoading<T>(resource: Resource<T>): boolean {
	const [, { loading }] = resource;
	const valueRef = useRef<boolean>(loading());

	useEffect(() => {
		valueRef.current = loading();
	}, [loading]);

	return valueRef.current;
}

export function useResourceError<T>(resource: Resource<T>): unknown {
	const [, { error }] = resource;
	const valueRef = useRef<unknown>(error());

	useEffect(() => {
		valueRef.current = error();
	}, [error]);

	return valueRef.current;
}
