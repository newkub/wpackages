import { BaseHandler, chain } from "./chain-of-responsibility";

class SupportHandler extends BaseHandler {
	constructor(private level: string) {
		super();
	}

	handle(request: string): string | null {
		if (request === this.level) {
			return `${this.level} handled the request`;
		}
		return super.handle(request);
	}
}

const level1 = new SupportHandler("Level 1");
const level2 = new SupportHandler("Level 2");
const level3 = new SupportHandler("Level 3");

const supportChain = chain([level1, level2, level3]);

console.log(supportChain.handle("Level 1"));
console.log(supportChain.handle("Level 2"));
console.log(supportChain.handle("Level 3"));
