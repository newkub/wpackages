import { Effect } from "effect";
import { AppTheme } from "../config";

interface ButtonProps {
	label: string;
	onClick: Effect.Effect<void>;
}

export const Button = (props: ButtonProps): string => {
	// In a real scenario, this would render a UI component.
	return `<button style="color:${AppTheme.primaryColor}">${props.label}</button>`;
};
