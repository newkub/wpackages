interface ButtonProps {
	label: string;
}

export const Button = (props: ButtonProps): string => {
	return `<button>${props.label}</button>`;
};
