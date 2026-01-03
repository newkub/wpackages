import { PromptDescriptor } from "@/types";
import React, { createContext, PropsWithChildren, useContext, useState } from "react";

export type GroupStepState = "pending" | "active" | "submitted";

interface GroupStep {
	key: string;
	state: GroupStepState;
	value: any;
	descriptor: PromptDescriptor<any, any>;
}

interface GroupContextValue {
	steps: GroupStep[];
	activeStepKey: string | null;
	submitStep: (key: string, value: any) => void;
}

const GroupContext = createContext<GroupContextValue | null>(null);

export function useGroup() {
	const context = useContext(GroupContext);
	if (!context) {
		throw new Error("useGroup must be used within a GroupProvider");
	}
	return context;
}

export function GroupProvider(
	{ children, prompts, onComplete }: PropsWithChildren<
		{ prompts: Record<string, PromptDescriptor<any, any>>; onComplete: (results: Record<string, any>) => void }
	>,
) {
	const initialSteps: GroupStep[] = Object.entries(prompts).map(([key, descriptor]) => ({
		key,
		state: "pending",
		value: undefined,
		descriptor,
	}));
	if (initialSteps.length > 0) {
		initialSteps[0].state = "active";
	}

	const [steps, setSteps] = useState<GroupStep[]>(initialSteps);
	const activeStepKey = steps.find(s => s.state === "active")?.key ?? null;

	const submitStep = (key: string, value: any) => {
		setSteps(prevSteps => {
			const newSteps = [...prevSteps];
			const currentStepIndex = newSteps.findIndex(step => step.key === key);

			if (currentStepIndex !== -1) {
				newSteps[currentStepIndex].state = "submitted";
				newSteps[currentStepIndex].value = value;

				const nextStepIndex = currentStepIndex + 1;
				if (nextStepIndex < newSteps.length) {
					newSteps[nextStepIndex].state = "active";
				} else {
					// All steps are done
					const results = newSteps.reduce((acc, step) => {
						acc[step.key] = step.value;
						return acc;
					}, {} as Record<string, any>);
					onComplete(results);
				}
			}
			return newSteps;
		});
	};

	return (
		<GroupContext.Provider value={{ steps, activeStepKey, submitStep }}>
			{children}
		</GroupContext.Provider>
	);
}
