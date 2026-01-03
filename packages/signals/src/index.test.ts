import { expect, mock, test } from "bun:test";
import { computed, effect, signal } from "./index";

test("signal should get and set value", () => {
	const count = signal(0);
	expect(count()).toBe(0);
	count(5);
	expect(count()).toBe(5);
});

test("effect should run when signal changes", () => {
	const count = signal(0);
	const fn = mock(() => {});

	effect(() => {
		count();
		fn();
	});

	expect(fn).toHaveBeenCalledTimes(1);
	count(1);
	expect(fn).toHaveBeenCalledTimes(2);
});

test("computed should update when dependency changes", () => {
	const count = signal(1);
	const double = computed(() => count() * 2);

	expect(double()).toBe(2);
	count(2);
	expect(double()).toBe(4);
});

test("computed should not re-run if dependencies do not change", () => {
	const count = signal(1);
	const computer = mock(() => count() * 2);
	const double = computed(computer);

	expect(computer).toHaveBeenCalledTimes(1);
	double();
	expect(computer).toHaveBeenCalledTimes(1);
	double();
	expect(computer).toHaveBeenCalledTimes(1);

	count(2);
	double();
	expect(computer).toHaveBeenCalledTimes(2);
});
