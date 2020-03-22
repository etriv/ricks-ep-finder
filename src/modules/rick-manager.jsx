const rickUrl = 'https://rickandmortyapi.com/api/';

function getEpisodes(character) {
    let fetchUrl = rickUrl + 'character/';
    fetchUrl += '?name=' + character;

    console.log('Fetching:', fetchUrl)
    return fetch(fetchUrl)
        .then(res => {
            if (res.status === 200)
                return res.json();
            return {};
        })
        .catch((e) => {
            console.log('Error while fetching inspirations:', e);
            return {};
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
            return {};
        })
        .then((data) => {
            console.log('Characters:', data);
            return {
                numOfPages: data.info.pages,
                names: data.results.reduce((names, value) => [...names, value.name], [])
            };
        })
        .catch((e) => {
            console.log('Error while fetching inspirations:', e);
            return {};
        });
}

export { getEpisodes, getAllCharacterNames };


// Available character parameters:
// name: filter by the given name.
// status: filter by the given status (alive, dead or unknown).
// species: filter by the given species.
// type: filter by the given type.
// gender: filter by the given gender (female, male, genderless or unknown).