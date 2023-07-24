import { useCallback, useEffect, useState } from 'react';

export type PromiseState<T = unknown> =
  | { status: 'standby' }
  | { status: 'pending' }
  | { status: 'resolved'; result: T }
  | { status: 'rejected'; error: unknown };

export function usePromise<TArg, TResult>(
  task: (arg: TArg) => Promise<TResult>
) {
  const [state, setState] = useState<PromiseState<TResult>>({
    status: 'standby',
  });

  const { status } = state;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    if (status === 'resolved' || status === 'rejected') {
      timeout = setTimeout(() => {
        setState({ status: 'standby' });
      }, 3000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [status]);

  const invoke = useCallback(
    async (arg: TArg) => {
      setState({ status: 'pending' });
      try {
        const result = await task(arg);
        const currentState = { result, status: 'resolved' } as const;
        setState(currentState);
        return currentState;
      } catch (error) {
        const currentState = { error, status: 'rejected' } as const;
        setState(currentState);
        return currentState;
      }
    },
    [task]
  );

  return {
    error: state.status === 'rejected' ? state.error : undefined,
    invoke,
    result: state.status === 'resolved' ? state.result : undefined,
    status: state.status,
  };
}
