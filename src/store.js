import { createAction, combineReducers, createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit'
import logger from 'redux-logger'

export const clickOk = createAction('util/clickOk');

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

const pokemon = createSlice({
  name: "pokemon",
  initialState: { 
    pokemon: [],
    detailLoading: false,
    detailName: "", 
    detailHeight: 0, 
    detailWeight: 0 
  },
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
      .addCase(clickOk, () => {
        console.log("it does nothing!")
      })
  }
})

const reducer = combineReducers({
  pokemon: pokemon.reducer
})

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: true,
});

export const { setPokemonName } = pokemon.actions;

export default store;