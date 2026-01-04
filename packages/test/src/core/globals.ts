import { addSuite } from "../services/suite.registry";
import type { TestCase, TestFunction, TestSuite } from "../types";

const useBunTest = process.env.WTEST_USE_BUN_TEST === "1";
const bunTest = useBunTest ? await import("bun:test").catch(() => null) : null;

let currentSuite: TestSuite | null = null;

function createSuite(name: string): TestSuite {
	return {
		name,
		tests: [],
		suites: [],
		beforeAllHooks: [],
		afterAllHooks: [],
		beforeEachHooks: [],
		afterEachHooks: [],
	};
}

export function describe(name: string, fn: () => void): void {
	if (bunTest) {
		bunTest.describe(name, fn);
		return;
	}
	const parentSuite = currentSuite;
	const newSuite = createSuite(name);

	if (parentSuite) {
		newSuite.beforeAllHooks = parentSuite.beforeAllHooks;
		newSuite.afterAllHooks = parentSuite.afterAllHooks;
		newSuite.beforeEachHooks = parentSuite.beforeEachHooks;
		newSuite.afterEachHooks = parentSuite.afterEachHooks;
		parentSuite.suites.push(newSuite);
	} else {
		addSuite(newSuite);
	}

	currentSuite = newSuite;
	fn();
	currentSuite = parentSuite;
}

function addTest(name: string, fn: TestFunction): void {
	if (!currentSuite) {
		// Allow tests to be defined at the top level
		const defaultSuite = createSuite("default");
		addSuite(defaultSuite);
		currentSuite = defaultSuite;
	}
	const testCase: TestCase = { name, fn };
	currentSuite.tests.push(testCase);
}

// Bun test runner compatibility
export function itBun(name: string, fn: TestFunction): void {
	if (!bunTest) {
		addTest(name, fn);
		return;
	}
	// bun:test expects sync fn or async fn
	bunTest.it(name, fn as any);
}
export function testBun(name: string, fn: TestFunction): void {
	if (!bunTest) {
		addTest(name, fn);
		return;
	}
	bunTest.test(name, fn as any);
}

// Re-export the correct function bindings based on mode
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const it = useBunTest ? ((name: string, fn: TestFunction) => itBun(name, fn)) : addTest;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const test = useBunTest ? ((name: string, fn: TestFunction) => testBun(name, fn)) : addTest;

export function beforeAll(fn: TestFunction): void {
	if (bunTest) {
		bunTest.beforeAll(fn as any);
		return;
	}
	if (currentSuite) {
		currentSuite.beforeAllHooks.push(fn);
	}
}

export function beforeEach(fn: TestFunction): void {
	if (bunTest) {
		bunTest.beforeEach(fn as any);
		return;
	}
	if (currentSuite) {
		currentSuite.beforeEachHooks.push(fn);
	}
}

export function afterAll(fn: TestFunction): void {
	if (bunTest) {
		bunTest.afterAll(fn as any);
		return;
	}
	if (currentSuite) {
		currentSuite.afterAllHooks.push(fn);
	}
}

export function afterEach(fn: TestFunction): void {
	if (bunTest) {
		bunTest.afterEach(fn as any);
		return;
	}
	if (currentSuite) {
		currentSuite.afterEachHooks.push(fn);
	}
}
