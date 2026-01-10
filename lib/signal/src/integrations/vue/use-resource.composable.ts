import { ref, watchEffect } from "vue";
import type { Accessor, Resource } from "../../types";
import { createResource as createCoreResource } from "../../services/resource.service";

export function useResource<T>(
	source: () => Promise<T> | T,
	initialValue?: T,
): Resource<T> {
	const resourceRef = ref<Resource<T>>();

	if (!resourceRef.value) {
		resourceRef.value = createCoreResource(source, initialValue);
	}

	const resource = resourceRef.value;
	const [data, { loading, error }] = resource;

	watchEffect(() => {
		data();
		loading();
		error();
	});

	return resource;
}

export function useResourceValue<T>(resource: Resource<T>): Accessor<T | undefined> {
	const [data] = resource;
	const valueRef = ref<T | undefined>(data());

	watchEffect(() => {
		valueRef.value = data();
	});

	return () => valueRef.value;
}

export function useResourceLoading<T>(resource: Resource<T>): Accessor<boolean> {
	const [, { loading }] = resource;
	const valueRef = ref<boolean>(loading());

	watchEffect(() => {
		valueRef.value = loading();
	});

	return () => valueRef.value;
}

export function useResourceError<T>(resource: Resource<T>): Accessor<unknown> {
	const [, { error }] = resource;
	const valueRef = ref<unknown>(error());

	watchEffect(() => {
		valueRef.value = error();
	});

	return () => valueRef.value;
}

export function useResourceState<T>(resource: Resource<T>) {
	return {
		data: useResourceValue(resource),
		loading: useResourceLoading(resource),
		error: useResourceError(resource),
		refetch: resource[1].refetch,
	};
}
