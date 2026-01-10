import { facade } from "../src/utils/facade";

const fileSystem = {
	readFile: (path: string) => `Content of ${path}`,
	writeFile: (path: string, _content: string) => `Written to ${path}`,
	deleteFile: (path: string) => `Deleted ${path}`,
};

const fileManager = facade(fileSystem);

console.log(fileManager.readFile("/path/to/file.txt"));
console.log(fileManager.writeFile("/path/to/file.txt", "Hello"));
console.log(fileManager.deleteFile("/path/to/file.txt"));
