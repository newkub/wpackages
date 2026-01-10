import { useEffect, useRef, useState } from "react";
import type { Accessor } from "../../types";
import { createMemo as createCoreMemo } from "../../apis/memo";

export function useMemo<T>(fn: () => T): Accessor<T> {
	const memoRef = useRef<Accessor<T>>();

	if (!memoRef.current) {
		memoRef.current = createCoreMemo(fn);
	}

	const memo = memoRef.current;
	const [, forceUpdate] = useState({});

	useEffect(() => {
		const effect = () => {
			memo();
			forceUpdate({});
		};

		effect();

		return () => {};
	}, [memo]);

	return memo;
}

export function useComputed<T>(fn: () => T): T {
	const memo = useMemo(fn, []);
	const [, forceUpdate] = useState({});
	const valueRef = useRef<T>(memo());

	useEffect(() => {
		valueRef.current = memo();
		forceUpdate({});
	}, [memo]);

	return valueRef.current;
}
