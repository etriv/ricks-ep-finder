import React, { useState, useEffect } from 'react';
import './search-area.scss';

function SerachArea({ onSearch, searchDisabled, characters }) {
    const [searchText, setSearchText] = useState('');
    const [nameList, setNameList] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    function onSearchTextChange(e) {
        setSearchText(e.target.value);
    }

    function onKeyUp(e) {
        if (e.keyCode === 13) {
            onSearchButtonClick();
        }
    }

    function onSearchButtonClick() {
        let characterName = '';

        if (nameList.filter(name =>
            name.toLowerCase() === searchText.toLowerCase()).length > 0) {
            characterName = searchText;
        }
        else {
            setErrorMsg('⚠️ Please choose an existing character ⚠️');
            return;
        }

        setErrorMsg('');

        onSearch(characterName);
    }

    // Updating name options when serachText changes
    useEffect(() => {
        nameOptionsList();

        function nameOptionsList() {
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
        }
    }, [searchText, characters]);

    return (
        <div className="search-container">
            <div className="search-area">
                <input name="search-text" className="search-box" list="names"
                    placeholder="Find a character..."
                    autoComplete="off"
                    value={searchText}
                    onChange={onSearchTextChange}
                    onKeyUp={onKeyUp} />
                <button className="search-button"
                    onClick={onSearchButtonClick}
                    disabled={searchDisabled}>
                    SEARCH
            </button>
                <datalist id="names">
                    {nameList.map((name, i) =>
                        <option value={name} key={name + i}>{name}</option>
                    )}
                </datalist>

            </div>
            {errorMsg !== '' ?
                <div className="error-msg">{errorMsg}</div>
                : null
            }
        </div>
    );
}

export default SerachArea;