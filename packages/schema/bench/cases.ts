import { array, number, object, string, union } from "../src";

export const makeCases = () => {
	const UserSchema = object({
		shape: {
			name: string().min(1).max(50),
			age: number().min(0).max(120).integer(),
			tags: array({ item: string().min(1) }),
		},
	});

	const StatusSchema = union({
		options: [string().min(1), number().min(0)] as const,
	});

	const validUser = { name: "Alice", age: 30, tags: ["ts", "fp"] };
	const invalidUser = { name: "", age: -1, tags: [""] };

	return {
		UserSchema,
		StatusSchema,
		validUser,
		invalidUser,
	};
};
