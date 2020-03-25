import React, { useState, useEffect } from 'react';
import './App.scss';
import { getEpisodes, getAllCharactersInPage } from './modules/rick-manager';
import MoonLoader from "react-spinners/MoonLoader";
import { charactersTempData } from './modules/temp-data';
import SearchArea from './components/search-area/search-area';
import Results from './components/results/results';

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

    // Find all the episode ids that the characters appears in
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

  // Setting up the display
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
          <Results
            imgUrl={currentChars[0].image}
            charName={currentChars[0].name}
            episodes={episodes}
            species={currentChars[0].species}
            speciesChars={characters.filter((char) =>
              char.species === currentChars[0].species)} />
        );
      }
      else {
        setDisplay(null);
      }
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
