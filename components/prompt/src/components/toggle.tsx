import { usePrompt } from "@/context";
import { PromptDescriptor, TogglePromptOptions } from "@/types";
import { Box, Text, useInput } from "ink";
import React from "react";

export const TogglePromptComponent: React.FC<TogglePromptOptions> = ({ message, active = "On", inactive = "Off" }) => {
	const { value, setValue, submit } = usePrompt<boolean>();

	useInput((input, key) => {
		if (key.return) {
			submit(value);
		} else if (key.leftArrow || key.rightArrow || input === " ") {
			setValue(!value);
		}
	});

	const toggle = value
		? `( ${active} )----`
		: `----( ${inactive} )`;

	return (
		<Box>
			<Text>{message}</Text>
			<Text color={value ? "cyan" : "gray"}>{toggle}</Text>
		</Box>
	);
};

export const toggle = (
	options: TogglePromptOptions,
): PromptDescriptor<boolean, TogglePromptOptions> => {
	return {
		Component: TogglePromptComponent,
		props: options,
		initialValue: options.initialValue ?? false,
	};
};
