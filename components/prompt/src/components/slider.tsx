import { usePrompt } from "@/context";
import { PromptDescriptor, SliderPromptOptions } from "@/types";
import { Box, Text, useInput } from "ink";
import React from "react";

export const SliderPromptComponent: React.FC<SliderPromptOptions> = ({
	message,
	min = 0,
	max = 100,
	step = 1,
	barWidth = 20,
}) => {
	const { value, setValue, submit } = usePrompt<number>();

	useInput((_, key) => {
		if (key.return) {
			submit(value);
		} else if (key.rightArrow) {
			const newValue = Math.min(value + step, max);
			setValue(newValue);
		} else if (key.leftArrow) {
			const newValue = Math.max(value - step, min);
			setValue(newValue);
		}
	});

	const percentage = ((value - min) / (max - min)) * 100;
	const filledWidth = Math.round((percentage / 100) * barWidth);
	const emptyWidth = barWidth - filledWidth;

	const bar = "█".repeat(filledWidth) + "─".repeat(emptyWidth);

	return (
		<Box>
			<Text>{message}</Text>
			<Text>[`</Text>
			<Text color="cyan">{bar}</Text>
			<Text>`]</Text>
			<Text color="cyan">{value}</Text>
		</Box>
	);
};

export const slider = (
	options: SliderPromptOptions,
): PromptDescriptor<number, SliderPromptOptions> => {
	return {
		Component: SliderPromptComponent,
		props: options,
		initialValue: options.initialValue ?? options.min ?? 0,
	};
};
