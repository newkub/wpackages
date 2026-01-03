import { usePrompt } from "@/context";
import { useInput } from "@/hooks";
import { PromptDescriptor, SelectPromptOptions } from "@/types";
import { Box, Text } from "ink";
import React, { useState } from "react";

export const SelectPromptComponent = <T,>({ message, options }: SelectPromptOptions<T>) => {
	const { submit } = usePrompt<T>();
	const [activeIndex, setActiveIndex] = useState(0);

	useInput((_, key) => {
		if (key.return) {
			if (options[activeIndex]) {
				submit(options[activeIndex].value);
			}
		} else if (key.upArrow) {
			setActiveIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
		} else if (key.downArrow) {
			setActiveIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
		}
	});

	return (
		<Box flexDirection="column">
			<Text>{message}</Text>
			{options.map((option, index) => (
				<Box key={option.label}>
					<Text color={activeIndex === index ? "cyan" : "gray"}>
						{activeIndex === index ? "❯" : " "} {option.label}
					</Text>
					{option.hint && <Text color="gray">({option.hint})</Text>}
				</Box>
			))}
		</Box>
	);
};

export const select = <T,>(
	options: SelectPromptOptions<T>,
): PromptDescriptor<T, SelectPromptOptions<T>> => {
	const initialValue = options.initialValue ?? options.options[0]?.value ?? null;
	return {
		Component: SelectPromptComponent as React.FC<SelectPromptOptions<T>>,
		props: options,
		initialValue: initialValue as T,
	};
};
