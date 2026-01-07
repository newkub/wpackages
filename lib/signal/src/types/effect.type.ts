export type EffectCleanup = () => void;

export interface Effect {
	(): void;
	cleanup?: EffectCleanup;
	deps?: Set<Set<Effect>>;
	dispose?: () => void;
}

export interface EffectScope {
	effects: Set<Effect>;
	dispose: () => void;
}

export type EffectFunction = Effect;

export type OnCleanup = (cleanup: EffectCleanup) => void;
