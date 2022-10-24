import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { rest } from 'msw'
import { setupServer } from 'msw/node';
import store, { pokemonSlice, fetchAllPokemon, fetchPokemon, initialState } from '../store';
import { getAllPokemonResponse, getPokemonDetailsResponse } from '../mocks/pokemonApiMock';

const { reducer } = pokemonSlice;

// Following recommendation of redux docs for testing async api call in thunk
// https://redux.js.org/usage/writing-tests#action-creators--thunks
// Following this patern for testing the reducer action
// https://stackoverflow.com/questions/62518929/how-to-write-tests-jest-enzyme-for-extrareducers-of-createslice

describe('pokemon create slice' , () => {
  const fetchPokemonName = "pikachu";
  const configuredStore = configureStore([thunk]);
  const mockStore = configuredStore(store);

  const handlers = [
    rest.get(`https://pokeapi.co/api/v2/pokemon/`, (req, res, ctx) => {
      return res(ctx.json(getAllPokemonResponse))
    }),
    rest.get(`https://pokeapi.co/api/v2/pokemon/${fetchPokemonName}/`, (req, res, ctx) => {
      return res(ctx.json(getPokemonDetailsResponse))
    }),
  ]

  const server = setupServer(...handlers)

  beforeAll(() => {
    server.listen();
    mockStore.clearActions()
  })

  afterEach(() => {
    server.resetHandlers();
  })

  afterAll(() => {
    server.close();
  })
  
  it('initial state', async () => {
    expect(mockStore.getState().getState().pokemon.detailLoading).toBe(false);
    expect(mockStore.getState().getState().pokemon.pokemon.length).toBe(0);
    expect(mockStore.getState().getState().pokemon.detailHeight).toBe(0);
    expect(mockStore.getState().getState().pokemon.detailWeight).toBe(0);
  })

  it('fetch All Pokemon ', async () => {
    const { payload, type } = await mockStore.dispatch(fetchAllPokemon());
    const action = { type: "fetchAllPokemon/fulfilled", payload };
    const state = reducer(initialState, action);

    expect(type).toBe("fetchAllPokemon/fulfilled");
    expect(payload).toEqual(getAllPokemonResponse);
    expect(state.pokemon).toEqual(getAllPokemonResponse.results);
  })

  it('fetch one Pokemon ', async() => {
    const result = await mockStore.dispatch(fetchPokemon(fetchPokemonName));
    const { payload } = result;
    const action = { type: "fetchPokemonDetail/fulfilled", payload };
    const state = reducer(initialState, action);

    expect(result.type).toBe("fetchPokemonDetail/fulfilled");
    expect(payload).toEqual(getPokemonDetailsResponse);
    expect(state.detailName).toBe("pikachu");
    expect(state.detailHeight).toBe(50);
    expect(state.detailWeight).toBe(20);
  })
})

