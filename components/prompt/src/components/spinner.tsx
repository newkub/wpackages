import { usePrompt } from "@/context";
import { PromptDescriptor, SpinnerPromptOptions } from "@/types";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React, { useEffect } from "react";

export const SpinnerComponent: React.FC<SpinnerPromptOptions> = ({ message, type = "dots" }) => {
	const { submit } = usePrompt<void>();

	useEffect(() => {
		// Spinners are display-only, so we submit immediately.
		const timer = setTimeout(() => submit(), 1000); // Simulate a task
		return () => clearTimeout(timer);
	}, [submit]);

	return (
		<Box>
			<Text color="green">
				<Spinner type={type} />
			</Text>
			<Box marginLeft={1}>
				<Text>{message}</Text>
			</Box>
		</Box>
	);
};

export const spinner = (
	options: SpinnerPromptOptions,
): PromptDescriptor<void, SpinnerPromptOptions> => {
	return {
		Component: SpinnerComponent,
		props: options,
		initialValue: undefined,
	};
};
