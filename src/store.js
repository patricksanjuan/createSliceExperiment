import { createAction, combineReducers, createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit'
import logger from 'redux-logger'

export const clickOk = createAction('util/clickOk');

export const initialState = { 
  pokemon: [],
  detailLoading: false,
  detailName: "", 
  detailHeight: 0, 
  detailWeight: 0 
};

// Naming conventions for asyncThunks are fairly open, 
// we don't even have to follow the / convention here if we don't want to
export const fetchPokemon = createAsyncThunk("fetchPokemonDetail", async input => {
  return await fetch(`https://pokeapi.co/api/v2/pokemon/${input}/`)
    .then((result) => {
      return result.json()
    })
    .then((data) => {
      return data;
    })
});

export const fetchAllPokemon = createAsyncThunk("fetchAllPokemon", async () => {
  const result = await fetch(`https://pokeapi.co/api/v2/pokemon/`)
  const data = result.json();
  return data;
});

// Maybe we should follow the convention of naming the var the same as the slice name?
export const pokemonSlice = createSlice({
  name: "pokemon",
  // If this section is too verbose, we can create it outside of the slice and declare it afterward
  initialState,
  reducers: {
    setPokemonName: (state, action) => {
      state.detailName = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state, action) => {
        state.detailLoading = true;
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailHeight = action.payload.height;
        state.detailWeight = action.payload.weight;
        state.detailName = action.payload.name;
      })
      .addCase(fetchAllPokemon.fulfilled, (state, action) => {
        state.pokemon = action.payload.results;
      })
      // An example of an "outside" action triggering an action in this reducer (could be from another reducer)
      .addCase(clickOk, () => {
        console.log("it does nothing!")
      })
  }
})

// This will be in the store index.js and exported to configure store in the root
const reducer = combineReducers({
  pokemon: pokemonSlice.reducer
})

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: true,
});

// We can follow this pattern to expose all native reducers from a slice to the app
export const { setPokemonName } = pokemonSlice.actions;

export default store;