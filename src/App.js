import { useCallback, useEffect } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { fetchPokemon, fetchAllPokemon, clickOk } from './store';

function App({ 
  fetchPokemon, 
  fetchAllPokemon, 
  detailLoading,
  pokemonName, 
  allPokemon,
  clickOk
}) {
  useEffect(() => {
    fetchAllPokemon();
    // eslint-disable-next-line
  }, []);

  // Add callbacks to improve performance
  const clickOkCallback = useCallback(() => {
    return () => { clickOk(); };
  },[clickOk]);
  
  const fetchPokemonCallback = useCallback((name) => {
    return () => { fetchPokemon(name); };
  },[fetchPokemon]);

  return (
    <div className="App">
      {
        !detailLoading && <div>
          <div>details</div>
          <div>{pokemonName}</div>
          <button onClick={clickOkCallback()}>Click!</button>
        </div>
      }
      <div>
        <ul>
          {allPokemon.map((p) =>
            (<li key={p.name} onClick={fetchPokemonCallback(p.name)}>{p.name}</li>)
          )}
        </ul>
      </div>
    </div>
  );
}

function mapStateToProps({ pokemon }) {
  return {
    detailLoading: pokemon.detailLoading,
    pokemonName: pokemon.detailName,
    allPokemon: pokemon.pokemon
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchPokemon, fetchAllPokemon, clickOk }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
