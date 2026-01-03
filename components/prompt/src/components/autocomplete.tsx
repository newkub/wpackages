import { Box, Text, useInput } from "ink";
import React, { useEffect, useState } from "react";
import { usePrompt } from "../context";
import { AutocompletePromptOptions, Option, PromptDescriptor } from "../types";

export const AutocompletePromptComponent = <T,>(
	{ message, options, placeholder = "" }: AutocompletePromptOptions<T>,
) => {
	const { submit } = usePrompt<T>();
	const [inputValue, setInputValue] = useState("");
	const [filteredOptions, setFilteredOptions] = useState(options);
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const newFilteredOptions = options.filter((option: Option<T>) =>
			option.label.toLowerCase().includes(inputValue.toLowerCase())
		);
		setFilteredOptions(newFilteredOptions);
		setActiveIndex(0); // Reset index when filter changes
	}, [inputValue, options]);

	useInput((input, key) => {
		if (key.return) {
			if (filteredOptions.length > 0) {
				if (filteredOptions[activeIndex]) {
					submit(filteredOptions[activeIndex].value);
				}
			}
		} else if (key.upArrow) {
			setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
		} else if (key.downArrow) {
			setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
		} else if (key.backspace) {
			setInputValue(prev => prev.slice(0, -1));
		} else {
			// Ignore special keys like arrows
			if (key.upArrow || key.downArrow || key.leftArrow || key.rightArrow) return;
			setInputValue(prev => prev + input);
		}
	});

	return (
		<Box flexDirection="column">
			<Box>
				<Text color="green">?</Text>
				<Box marginLeft={1}>
					<Text>{message}</Text>
				</Box>
			</Box>

			<Box marginTop={1}>
				<Text color="cyan">❯</Text>
				<Text>{inputValue || <Text color="gray">{placeholder}</Text>}</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				{filteredOptions.slice(0, 5).map((option: Option<T>, index: number) => (
					<Box key={option.label}>
						<Text color={activeIndex === index ? "cyan" : "gray"}>
							{activeIndex === index ? "●" : "○"} {option.label}
						</Text>
						{option.hint && activeIndex === index && <Text color="gray">- {option.hint}</Text>}
					</Box>
				))}
			</Box>
		</Box>
	);
};

export const autocomplete = <T,>(
	options: AutocompletePromptOptions<T>,
): PromptDescriptor<T, AutocompletePromptOptions<T>> => {
	const initialValue = options.initialValue ?? options.options[0]?.value ?? null;
	return {
		Component: AutocompletePromptComponent as React.FC<AutocompletePromptOptions<T>>,
		props: options,
		initialValue: initialValue as T,
	};
};
