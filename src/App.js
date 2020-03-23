import React, { useState, useEffect } from 'react';
import './App.scss';
import { getEpisodes, getAllCharactersInPage } from './modules/rick-manager';
import MoonLoader from "react-spinners/MoonLoader";
import { charactersTempData } from './modules/temp-data';

function App() {
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(-1);
  const [searchText, setSearchText] = useState('');
  const [fetchingNewSearch, setFetchingNewSearch] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [nameList, setNameList] = useState([]);
  const devMode = true;

  // Fetch and init all of the existing characters
  useEffect(() => {
    if (devMode) { setCharacters(charactersTempData); return; }

    getAllCharactersInPage(1)
      .then((data) => {
        setCharacters(data.characters);
        if (data.numOfPages < 2) return;

        for (let pageNum = 2; pageNum <= data.numOfPages; pageNum++) {
          getAllCharactersInPage(pageNum)
            .then((data) => {
              setCharacters(prev => [...prev, ...data.characters]);
            })
            .catch(e => console.log('Error while fetching names:', e))
        }
      })
      .catch(e => console.log('Error while fetching names:', e));
  }, [devMode]);

  useEffect(() => {
    console.log('characters', characters);
  }, [characters]);

  function onSearchTextChange(e) {
    setSearchText(e.target.value);
  }

  // Updating name options when serachText changes
  useEffect(() => {
    if (searchText.length > 0) {
      setNameList(characters.reduce((names, char) => {
        // console.log('char', char);
        if (char.name.toLowerCase().indexOf(searchText.toLowerCase()) === 0
          && !names.includes(char.name)) {
          names.push(char.name);
        }
        return names;
      }, []).sort());
    }
    else {
      setNameList([]);
    }
  }, [searchText, characters]);

  function onKeyUp(e) {
    if (e.keyCode === 13) {
      onSearchClick();
    }
  }

  function onSearchClick() {
    let character = '';
    if (searchText === '') // TODO: Remove after dev is complete
      character = 'Rick Sanchez';
    else if (nameList.filter(name =>
      name.toLowerCase() === searchText.toLowerCase()).length > 0) {
      character = searchText;
    }
    else {
      alert('Please choose an existing character from the list');
      return;
    }
    
    setFetchingNewSearch(true);
    getEpisodes(character)
      .then(data => {
        console.log('Fetched:', data);
        setTotalCount(data.info.count);
        setResults(data.results);
        setFetchingNewSearch(false);
      })
      .catch(err => {
        console.log('Error while fetching episodes:', err);
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
        <input name="search-text" className="search-box" list="names"
          placeholder="Find a character..."
          autoComplete="off"
          value={searchText}
          onChange={onSearchTextChange}
          onKeyUp={onKeyUp} />
        <button className="search-button"
          onClick={onSearchClick}
          disabled={fetchingNewSearch}>
          <span role="img" aria-label="magnify glass">SEARCH</span>
        </button>
        <datalist id="names">
          {nameList.map((name, i) =>
            <option value={name} key={name + i} />
          )}
        </datalist>
      </div>
      {display}
    </div>
  );
}

export default App;
