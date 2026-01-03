import { usePrompt } from "@/context";
import { useInput } from "@/hooks";
import { ConfirmPromptOptions, PromptDescriptor } from "@/types";
import { Box, Text } from "ink";
import React from "react";

export const ConfirmPromptComponent: React.FC<ConfirmPromptOptions> = (
	{ message, positive = "Yes", negative = "No" },
) => {
	const { value, setValue, submit } = usePrompt<boolean>();

	useInput((_, key) => {
		if (key.return) {
			submit(value);
		} else if (key.leftArrow || key.rightArrow) {
			setValue(!value);
		}
	});

	return (
		<Box>
			<Text>{message}</Text>
			<Text color={value ? "cyan" : "gray"}>{positive}</Text>
			<Text>/</Text>
			<Text color={!value ? "cyan" : "gray"}>{negative}</Text>
		</Box>
	);
};

export const confirm = (
	options: ConfirmPromptOptions,
): PromptDescriptor<boolean, ConfirmPromptOptions> => {
	return {
		Component: ConfirmPromptComponent,
		props: options,
		initialValue: options.initialValue ?? false,
	};
};
