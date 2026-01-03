import { usePrompt } from "@/context";
import { PromptDescriptor, RatingPromptOptions } from "@/types";
import { Box, Text, useInput } from "ink";
import React from "react";

export const RatingPromptComponent: React.FC<RatingPromptOptions> = ({ message, max = 5, character = "★" }) => {
	const { value, setValue, submit } = usePrompt<number>();

	useInput((_, key) => {
		if (key.return) {
			submit(value);
		} else if (key.rightArrow) {
			setValue(Math.min(value + 1, max));
		} else if (key.leftArrow) {
			setValue(Math.max(value - 1, 0));
		}
	});

	const stars = Array.from({ length: max }, (_, i) => {
		const isFilled = i < value;
		return <Text key={i} color={isFilled ? "yellow" : "gray"}>{character}</Text>;
	});

	return (
		<Box>
			<Text>{message}</Text>
			{stars}
		</Box>
	);
};

export const rating = (
	options: RatingPromptOptions,
): PromptDescriptor<number, RatingPromptOptions> => {
	return {
		Component: RatingPromptComponent,
		props: options,
		initialValue: options.initialValue ?? 0,
	};
};
