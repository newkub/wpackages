let currentEffect: (() => void) | null = null;

type Subscribers = Set<() => void>;

export function signal<T>(initialValue: T) {
    let value = initialValue;
    const subscribers: Subscribers = new Set();

    const signalFunc = (...args: [T] | []) => {
        if (args.length === 0) {
            if (currentEffect) {
                subscribers.add(currentEffect);
            }
            return value;
        }

        value = args[0];
        for (const sub of subscribers) {
            sub();
        }
        return value;
    };

    return signalFunc;
}

export function effect(callback: () => void) {
    const effectFunc = () => {
        const prevEffect = currentEffect;
        currentEffect = effectFunc;
        try {
            callback();
        } finally {
            currentEffect = prevEffect;
        }
    };
    effectFunc();
}

export function computed<T>(computer: () => T) {
    const computedSignal = signal<T>(undefined as any);
    
    effect(() => {
        computedSignal(computer());
    });

    return () => computedSignal();
}
