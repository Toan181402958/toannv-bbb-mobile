import { ReactiveVar, makeVar, useReactiveVar } from '@apollo/client';

function createUseLocalState(initialValue) {
  const localState = makeVar(initialValue);

  function useLocalState() {
    const reactiveLocalState = useReactiveVar(localState);
    return [reactiveLocalState, changeLocalState];
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  function changeLocalState(value) {
    if (value instanceof Function) {
      return localState(value(localState()));
    }
    return localState(value);
  }

  return [useLocalState, changeLocalState, localState];
}

export default createUseLocalState;
