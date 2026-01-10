import { singleton } from "../src/utils/singleton";

class DatabaseConnection {
	constructor(private connectionString: string) {
		console.log(`Connecting to ${connectionString}`);
	}

	query(sql: string) {
		console.log(`Executing: ${sql}`);
		return "result";
	}
}

const getDatabase = singleton(() => new DatabaseConnection("postgres://localhost"));

const db1 = getDatabase();
const db2 = getDatabase();

console.log(db1 === db2);

db1.query("SELECT * FROM users");
db2.query("SELECT * FROM posts");
