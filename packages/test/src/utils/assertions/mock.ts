import { AssertionError } from '../../error';
import type { MockFn } from '../mock';
import { isEqual } from '../diff';

function assertIsMock(actual: any, assertionName: string): asserts actual is MockFn<any> {
    if (!actual || typeof actual.mockReturnValue !== 'function') {
        throw new AssertionError(`Matcher ${assertionName} must be used with a w.fn() or w.spyOn() mock.`);
    }
}

export function toHaveBeenCalled(actual: MockFn<any>): void {
    assertIsMock(actual, 'toHaveBeenCalled');
    if (actual.callCount === 0) {
        throw new AssertionError('Expected mock function to have been called.');
    }
}

export function toHaveBeenCalledWith(actual: MockFn<any>, ...expectedArgs: any[]): void {
    assertIsMock(actual, 'toHaveBeenCalledWith');
    const calls = actual.calls;
    const passed = calls.some(call => isEqual(call, expectedArgs));

    if (!passed) {
        throw new AssertionError(`Expected mock function to have been called with arguments: ${JSON.stringify(expectedArgs)}`);
    }
}
