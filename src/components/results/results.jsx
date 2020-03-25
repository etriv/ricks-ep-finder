import React from 'react';
import './results.scss';

function Results({ imgUrl, charName, episodes, species, speciesChars}) {
    
    function getCharactersParagraph(chars) {
        return chars.map((char, i) => {
            if (i < chars.length - 1)
                return char.name + ', ';
            else
                return char.name;
        });
    }

    return (
        <div className="results-container">
            <img className="char-img" src={imgUrl} alt="Character" />
            <p className="results-title"><i>{charName}</i> appears in:</p>
            <div className="episodes-container">
                {episodes.map((ep, i) =>
                    <div className="episode-details" key={i}>
                        {ep.episode + ': '}<b>{ep.name}</b>
                    </div>
                )}
            </div>
            <p className="results-title">Characters of the <i>{species}</i> species:</p>
            <div className="recommended-container">
                {getCharactersParagraph(speciesChars)}
            </div>
        </div>
    );
}

export default Results;