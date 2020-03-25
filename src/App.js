import React, { useState, useEffect } from 'react';
import './App.scss';
import { getEpisodes, getAllCharactersInPage } from './modules/rick-manager';
import MoonLoader from "react-spinners/MoonLoader";
import { charactersTempData } from './modules/temp-data';
import SearchArea from './components/search-area/search-area';

function App() {
  const [episodes, setEpisodes] = useState([]);
  const [currentChars, setCurrentChars] = useState([]);
  const [fetchingNewSearch, setFetchingNewSearch] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [display, setDisplay] = useState(null);
  const devMode = true;

  // Fetch and init all of the existing characters
  useEffect(() => {
    initCharacters();

    function initCharacters() {
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
    }
  }, [devMode]);

  useEffect(() => {
    console.log('characters', characters);
  }, [characters]);

  function getEpisodeIdsByChars(charsInfo) {
    const episodeIds = charsInfo.reduce((epIds, char) => {
      for (let epUrl of char.episode) {
        const epId = epUrl.slice(epUrl.indexOf('episode/') + 8);
        if (!epIds.includes(epId))
          epIds.push(epId);
      }
      return epIds;
    }, []);

    return episodeIds.sort();
  }

  function onSearch(characterName) {
    setFetchingNewSearch(true);

    // Find all characters that share the exact same name
    const charsInfo = characters.filter(char => char.name === characterName);
    setCurrentChars(charsInfo);
    // console.log('CharsInfo:', charsInfo);

    // Find all the episode ids that the characters appear in
    const episodeIds = getEpisodeIdsByChars(charsInfo);
    // console.log('episodeIds list:', episodeIds);

    // Fetch the info about the found episodes
    getEpisodes(episodeIds)
      .then(data => {
        console.log('Fetched episodes:', data);
        setEpisodes(data);
        setFetchingNewSearch(false);
      })
      .catch(err => {
        console.log('Error while fetching episodes:', err);
        setFetchingNewSearch(false);
      });
  }

  // Setting up result's display
  useEffect(() => {
    updateDisplay();

    function updateDisplay() {
      if (fetchingNewSearch) {
        setDisplay(
          <MoonLoader
            css={"margin: 4rem auto"}
            size={100}
            color={"#b83b5e"} />
        );
      }
      else if (episodes.length > 0 && currentChars.length > 0) {
        setDisplay(
          <div className="results-container">
            <img className="char-img" src={currentChars[0].image} alt="Character" />
            <p className="results-title"><i>{currentChars[0].name}</i> appears in:</p>
            <div className="episodes-container">
              {episodes.map((ep, i) =>
                <div className="episode-details" key={i}>
                  {ep.episode + ': '}<b>{ep.name}</b>
                </div>
              )}
            </div>
            <p className="results-title">Characters of the <i>{currentChars[0].species}</i> species:</p>
            <div className="recommended-container">
              {getCharactersParagraph(getCharactersBySpecies(currentChars[0].species))}
            </div>
          </div>
        );
      }
    }

    function getCharactersParagraph(chars) {
      return chars.map((char, i) => {
        if (i < chars.length - 1)
          return char.name + ', ';
        else
          return char.name;
      });
    }

    function getCharactersBySpecies(species) {
      return characters.filter((char) => char.species === species);
    }
  }, [fetchingNewSearch, episodes, currentChars, characters]);

  return (
    <div className="App">
      <h1 className="title">R&M episode finder! <span role="img" aria-label="UFO">🛸</span></h1>
      <SearchArea
        characters={characters}
        searchDisabled={fetchingNewSearch}
        onSearch={onSearch} />
      {display}
    </div>
  );
}

export default App;
