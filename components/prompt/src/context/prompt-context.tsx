import { renderer as legacyRenderer } from "@/services"; // Keep legacy for now
import { PromptDescriptor } from "@/types";
import React, { createContext, PropsWithChildren, useContext, useState } from "react";

export type PromptState = "active" | "submitting" | "submitted" | "cancelled";

interface PromptContextValue<T> {
	value: T;
	setValue: (value: T) => void;
	state: PromptState;
	submit: (value: T) => void;
	cancel: () => void;
}

const PromptContext = createContext<PromptContextValue<any> | null>(null);

export function usePrompt<T>() {
	const context = useContext(PromptContext as React.Context<PromptContextValue<T>>);
	if (!context) {
		throw new Error("usePrompt must be used within a PromptProvider");
	}
	return context;
}

export function PromptProvider<T>(
	{ children, initialValue, onCancel, onSubmit }: PropsWithChildren<
		{ initialValue: T; onSubmit: (value: T) => void; onCancel: () => void }
	>,
) {
	const [value, setValue] = useState<T>(initialValue);
	const [state, setState] = useState<PromptState>("active");

	const submit = (val: T) => {
		if (state === "active") {
			setState("submitting");
			onSubmit(val);
			// The renderer will be unmounted by the calling function
		}
	};

	const cancel = () => {
		if (state === "active") {
			setState("cancelled");
			onCancel();
		}
	};

	return (
		<PromptContext.Provider value={{ value, setValue, state, submit, cancel }}>
			{children}
		</PromptContext.Provider>
	);
}

export function prompt<T>(
	descriptor: PromptDescriptor<T, any>,
): Promise<T | symbol> {
	return new Promise((resolve) => {
		const onCancel = () => {
			legacyRenderer.unmount();
			resolve(Symbol.for("cancel"));
		};

		const onSubmit = (value: T) => {
			legacyRenderer.unmount();
			resolve(value);
		};

		legacyRenderer.render(
			<PromptProvider
				initialValue={descriptor.initialValue}
				onSubmit={onSubmit}
				onCancel={onCancel}
			>
				<descriptor.Component {...descriptor.props} />
			</PromptProvider>,
		);
	});
}
