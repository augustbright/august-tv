import { checkExhaustiveness } from '@august-tv/common';

import { Dispatch, Reducer, useReducer } from 'react';

type TSignInState = {
  page:
    | 'signIn'
    | 'signUp'
    | 'forgotPassword'
    | 'empty'
    | 'account-created'
    | 'resend-email';
};

type TSignInAction = {
  type: 'setPage';
  page: TSignInState['page'];
};

type TSignInReducer = Reducer<TSignInState, TSignInAction>;
export type TSignInMachine = {
  state: TSignInState;
  dispatch: Dispatch<TSignInAction>;
};

export const useSignInStateMachine = (): TSignInMachine => {
  const [state, dispatch] = useReducer<TSignInReducer>(
    (state, action) => {
      switch (action.type) {
        case 'setPage':
          return {
            ...state,
            page: action.page
          };
        default:
          checkExhaustiveness(action.type);
          return state;
      }
    },
    {
      page: 'signIn'
    }
  );

  return {
    state,
    dispatch
  };
};
