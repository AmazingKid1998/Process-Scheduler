// src/store/reducer.js
export const initialState = {
  processes: [
    { id: 'P1', name: 'P1', arrival: 0, burst: 5 },
    { id: 'P2', name: 'P2', arrival: 1, burst: 3 },
    { id: 'P3', name: 'P3', arrival: 2, burst: 8 },
  ],
  algorithm: 'RR',
  quantum: 2,
  result: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'setProcesses': return { ...state, processes: action.payload };
    case 'setAlgorithm': return { ...state, algorithm: action.payload };
    case 'setQuantum': return { ...state, quantum: action.payload };
    case 'setResult': return { ...state, result: action.payload };
    default: return state;
  }
}
