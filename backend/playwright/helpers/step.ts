import { test } from '../tests/login.fixtures';

export function step(stepName?: string) {
  return function decorator(
    target: Function,
    context: ClassMethodDecoratorContext,
  ) {
    return function replacementMethod(...args: any) {
      const name = `${stepName}`;
      return test.step(name, async () => {
        return await target.call(this, ...args);
      });
    };
  };
}
