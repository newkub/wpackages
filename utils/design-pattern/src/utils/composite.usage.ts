import { Composite, leaf } from "./composite";

const file1 = leaf("file1.txt");
const file2 = leaf("file2.txt");

const folder = new Composite();
folder.add(file1);
folder.add(file2);

const file3 = leaf("file3.txt");
const rootFolder = new Composite();
rootFolder.add(folder);
rootFolder.add(file3);

console.log(rootFolder.operation());
