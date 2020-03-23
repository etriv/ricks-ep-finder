const rickUrl = 'https://rickandmortyapi.com/api/';

function getEpisodes(episodeIds) {
    let fetchUrl = rickUrl + 'episode/';
    fetchUrl += episodeIds;

    console.log('Fetching:', fetchUrl)
    return fetch(fetchUrl)
        .then(res => {
            if (res.status === 200)
                return res.json();
            throw new Error('Could not find episodes');
        })
        .then(data => {
            if (episodeIds.length === 1) {
                return [data];
            }
            return data;
        })
        .catch((e) => {
            console.log('Error while fetching episodes:', e);
            throw e;
        });
}

function getAllCharacterNames(page) {
    let fetchUrl = rickUrl + 'character/';
    fetchUrl += '?page=' + page;
    console.log('Fetching:', fetchUrl)

    return fetch(fetchUrl)
        .then(res => {
            if (res.status === 200)
                return res.json();
            throw new Error('Could not find names');
        })
        .then((data) => {
            console.log('Characters:', data);
            return {
                numOfPages: data.info.pages,
                names: data.results.reduce((names, value) =>
                    [...names, value.name], [])
            };
        })
        .catch((e) => {
            console.log('Error while fetching character names:', e);
            throw e;
        });
}

function getAllCharactersInPage(page) {
    let fetchUrl = rickUrl + 'character/';
    fetchUrl += '?page=' + page;
    console.log('Fetching:', fetchUrl)

    return fetch(fetchUrl)
        .then(res => {
            if (res.status === 200)
                return res.json();
            throw new Error('Could not find characters');
        })
        .then((data) => {
            console.log('Fetched characters:', data);

            return {
                numOfPages: data.info.pages,
                characters: data.results
            };
        })
        .catch((e) => {
            console.log('Error while fetching characters:', e);
            throw e;
        });
}

export { getEpisodes, getAllCharacterNames, getAllCharactersInPage };


// Available character parameters:
// name: filter by the given name.
// status: filter by the given status (alive, dead or unknown).
// species: filter by the given species.
// type: filter by the given type.
// gender: filter by the given gender (female, male, genderless or unknown).