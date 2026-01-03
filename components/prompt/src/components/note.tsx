import { usePrompt } from "@/context";
import { NotePromptOptions, PromptDescriptor } from "@/types";
import { Box, Text } from "ink";
import React, { useEffect } from "react";

const typeConfig = {
	info: { color: "blue", symbol: "ℹ" },
	success: { color: "green", symbol: "✔" },
	warning: { color: "yellow", symbol: "⚠" },
	error: { color: "red", symbol: "✖" },
};

export const NoteComponent: React.FC<NotePromptOptions> = ({ title, message, type = "info" }) => {
	const { submit } = usePrompt<void>();

	useEffect(() => {
		// Notes are display-only, so we submit immediately.
		submit();
	}, [submit]);

	const { color, symbol } = typeConfig[type];

	return (
		<Box borderStyle="round" borderColor={color} paddingX={1} flexDirection="column">
			<Box>
				<Text color={color}>{symbol}</Text>
				{title && <Text bold>{title}</Text>}
			</Box>
			<Text>{message}</Text>
		</Box>
	);
};

export const note = (
	options: NotePromptOptions,
): PromptDescriptor<void, NotePromptOptions> => {
	return {
		Component: NoteComponent,
		props: options,
		initialValue: undefined,
	};
};
