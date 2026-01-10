export function state<T extends Record<string, any>>(
	initialState: T,
): {
	getState: () => T;
	setState: (newState: Partial<T>) => void;
} {
	let state = { ...initialState };

	return {
		getState: () => ({ ...state }),
		setState: (newState) => {
			state = { ...state, ...newState };
		},
	};
}
