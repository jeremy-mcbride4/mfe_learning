let state = {
  selectedQuote: null,
  scheduledJobs: [],
};

const listeners = new Set();

const store = {
  getState: () => state,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setSelectedQuote: (quote) => {
    state = { ...state, selectedQuote: quote };
    listeners.forEach(l => l(state));
  },
  addScheduledJob: (job) => {
    state = { ...state, scheduledJobs: [...state.scheduledJobs, job] };
    listeners.forEach(l => l(state));
  },
};

export default store;
