import { addMockedModule } from "./mockRegistry";
import { createMock } from "../utils/mock";
import { spyOn } from "../utils/spy";

export const w = {
	fn: createMock,
	spyOn: spyOn,
	mock: (modulePath: string, factory?: () => any): void => {
		addMockedModule(modulePath, factory);
	},
};
