import React, { useState, useEffect } from 'react';
import './App.scss';
import { getEpisodes, getAllCharacterNames } from './modules/rick-manager';
import MoonLoader from "react-spinners/MoonLoader";
import { characterNames } from './modules/temp-data';

function App() {
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(-1);
  const [searchText, setSearchText] = useState('');
  const [fetchingNewSearch, setFetchingNewSearch] = useState(false);
  const [charNames, setCharNames] = useState([]);

  // useEffect(() => {
  //   getAllCharacterNames(1)
  //   .then((data) => {
  //     setCharNames(data.names);
  //     if (data.numOfPages < 2) return;

  //     for(let pageNum = 2; pageNum <= data.numOfPages; pageNum++) {
  //       getAllCharacterNames(pageNum)
  //       .then((data) => {
  //         setCharNames(prev => [...prev, ...data.names]);
  //       })
  //       .catch(e => console.log('Error while fetching names:', e))
  //     }
  //   })
  //   .catch(e => console.log('Error while fetching names:', e));
  // }, []);

  useEffect(() => {
    setCharNames(characterNames);
  }, []);

  useEffect(() => {
    console.log('charNames', charNames);
  }, [charNames]);

  function onSearchTextChange(e) {
    setSearchText(e.target.value);
  }

  function onKeyUp(e) {
    if (e.keyCode === 13) {
      onSearchClick();
    }
  }

  function onSearchClick() {
    setFetchingNewSearch(true);
    let character = '';
    if (searchText === '') // TODO: Remove adter dev is complete
      character = 'rick';
    else
      character = searchText;

    getEpisodes(character)
      .then(data => {
        console.log('Fetched:', data);
        setTotalCount(data.info.count);
        setResults(data.results);
        setFetchingNewSearch(false);
      })
      .catch(err => {
        console.log('Error while fetching gifs:', err);
        setFetchingNewSearch(false);
      });
  }

  let display = null;
  if (fetchingNewSearch) {
    display = <MoonLoader
      css={"margin: 4rem auto"}
      size={100}
      color={"#b83b5e"} />;
  }

  return (
    <div className="App">
      <h1 className="title">R&M episode finder! <span role="img" aria-label="UFO">🛸</span></h1>
      <div className="search-area">
        <input name="search-text" className="search-box" type="text"
          placeholder="Enter character name..."
          value={searchText}
          onChange={onSearchTextChange}
          onKeyUp={onKeyUp} />
        <button className="search-button"
          onClick={onSearchClick}
          disabled={fetchingNewSearch}>
          <span role="img" aria-label="magnify glass">SEARCH</span>
        </button>
      </div>
      {/* {charNames.map((name, i) =>
        <p key={i}>{name}</p>
      )} */}
      {display}
    </div>
  );
}

export default App;
