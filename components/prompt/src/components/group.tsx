import { PromptProvider } from "@/context";
import { GroupProvider, useGroup } from "@/context/group-context";
import { renderer } from "@/services";
import { Box, Text } from "ink";
import React from "react";

const GroupComponent: React.FC = () => {
	const { steps, submitStep } = useGroup();
	const activeStep = steps.find(step => step.state === "active");

	return (
		<Box flexDirection="column">
			{steps.map(step => {
				if (step.state === "submitted") {
					return <Text key={step.key}>✔ {step.key}: {String(step.value)}</Text>;
				}
				return null;
			})}

			{activeStep && (
				<PromptProvider
					key={activeStep.key}
					initialValue={activeStep.descriptor.initialValue}
					onSubmit={(value) => {
						submitStep(activeStep.key, value);
					}}
					onCancel={() => {
						submitStep(activeStep.key, Symbol.for("cancel"));
					}}
				>
					<activeStep.descriptor.Component {...activeStep.descriptor.props} />
				</PromptProvider>
			)}
		</Box>
	);
};

import { PromptDescriptor } from "@/types";

export function group<T extends Record<string, PromptDescriptor<any, any>>>(
	prompts: T,
): Promise<{ [K in keyof T]: T[K] extends PromptDescriptor<infer V, any> ? V : never } | symbol> {
	return new Promise(resolve => {
		const onComplete = (results: Record<string, any>) => {
			renderer.unmount();
			resolve(results as any);
		};

		renderer.render(
			<GroupProvider prompts={prompts} onComplete={onComplete}>
				<GroupComponent />
			</GroupProvider>,
		);
	});
}
