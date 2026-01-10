import { command } from "../src/utils/command";

const history: Array<() => void> = [];

const addCommand = command(
	() => {
		console.log("Item added");
	},
	() => {
		console.log("Item removed (undo)");
	},
);

const removeCommand = command(
	() => {
		console.log("Item removed");
	},
	() => {
		console.log("Item restored (undo)");
	},
);

addCommand.execute();
history.push(addCommand.undo);

removeCommand.execute();
history.push(removeCommand.undo);

console.log("\nUndoing last action:");
history.pop()?.call();
