import { usePrompt } from "@/context";
import { useInput } from "@/hooks";
import { PasswordPromptOptions, PromptDescriptor } from "@/types";
import { Box, Text } from "ink";
import React from "react";

export const PasswordPromptComponent: React.FC<PasswordPromptOptions> = ({ message }) => {
	const { value, setValue, submit, state } = usePrompt<string>();

	useInput((input, key) => {
		if (key.return) {
			submit(value);
		} else if (key.backspace) {
			setValue(value.slice(0, -1));
		} else {
			setValue(value + input);
		}
	});

	return (
		<Box>
			<Text>{message}</Text>
			{state === "submitted"
				? <Text color="cyan">{"*".repeat(value.length)}</Text>
				: <Text color="gray">{"*".repeat(value.length)}</Text>}
		</Box>
	);
};

export const password = (
	options: PasswordPromptOptions,
): PromptDescriptor<string, PasswordPromptOptions> => {
	return {
		Component: PasswordPromptComponent,
		props: options,
		initialValue: options.initialValue ?? "",
	};
};
