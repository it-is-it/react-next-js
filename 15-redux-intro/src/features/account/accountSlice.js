import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
  isLoading: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },

    withdraw(state, action) {
      state.balance -= action.payload;
    },

    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },
      reducer(state, action) {
        if (state.loan > 0) return; // Prevent taking multiple loans
        state.loan = action.payload.amount;
        state.balance += action.payload.amount;
        state.loanPurpose = action.payload.purpose; // Update loanPurpose with the correct field
      },
    },

    payLoan(state) {
      // Check if balance is sufficient before paying off the loan
      if (state.balance >= state.loan) {
        state.balance -= state.loan;
        state.loan = 0;
        state.loanPurpose = '';
      } else {
        console.error('Insufficient funds to pay the loan');
      }
    },
    converitngCurrency(state) {
      state.isLoading = true;
    },
  },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

export function deposit(amount, currency) {
  if (currency === 'USD') return { type: 'account/deposit', payload: amount };
  return async function (dispatch, getState) {
    dispatch({ type: 'account/converitngCurrency' });
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );

    const data = await res.json();
    const converted = data.rates.USD;

    dispatch({ type: 'account/deposit', payload: converted });
  };
}

export default accountSlice.reducer;
