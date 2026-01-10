export abstract class TemplateMethod {
	abstract step1(): string;
	abstract step2(): string;
	abstract step3(): string;

	execute(): string {
		return `${this.step1()} -> ${this.step2()} -> ${this.step3()}`;
	}
}

export function templateMethod<T extends TemplateMethod>(template: T): T {
	return template;
}
