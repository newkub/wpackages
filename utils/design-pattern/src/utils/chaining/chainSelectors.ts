type Selector<T, U> = (input: T) => U;

export function chainSelectors<A, B>(s1: Selector<A, B>): Selector<A, B>;
export function chainSelectors<A, B, C>(s1: Selector<A, B>, s2: Selector<B, C>): Selector<A, C>;
export function chainSelectors<A, B, C, D>(s1: Selector<A, B>, s2: Selector<B, C>, s3: Selector<C, D>): Selector<A, D>;
export function chainSelectors<A, B, C, D, E>(
	s1: Selector<A, B>,
	s2: Selector<B, C>,
	s3: Selector<C, D>,
	s4: Selector<D, E>,
): Selector<A, E>;
export function chainSelectors<A, B, C, D, E, F>(
	s1: Selector<A, B>,
	s2: Selector<B, C>,
	s3: Selector<C, D>,
	s4: Selector<D, E>,
	s5: Selector<E, F>,
): Selector<A, F>;
export function chainSelectors<A, B, C, D, E, F, G>(
	s1: Selector<A, B>,
	s2: Selector<B, C>,
	s3: Selector<C, D>,
	s4: Selector<D, E>,
	s5: Selector<E, F>,
	s6: Selector<F, G>,
): Selector<A, G>;

/**
 * Chains multiple selector functions together, where the output of one selector becomes the input for the next.
 * This allows for the creation of complex data transformation pipelines from smaller, reusable selectors.
 *
 * @param {...Selector<any, any>[]} selectors A sequence of selector functions to chain.
 * @returns {Selector<any, any>} A new selector function that represents the entire chain.
 * @throws {Error} If no selectors are provided.
 */
export function chainSelectors(...selectors: Array<Selector<unknown, unknown>>): Selector<unknown, unknown> {
	if (selectors.length === 0) {
		throw new Error("chainSelectors requires at least one selector.");
	}

	return (initialInput: unknown) => {
		return selectors.reduce((currentInput, selector) => {
			return selector(currentInput);
		}, initialInput);
	};
}
