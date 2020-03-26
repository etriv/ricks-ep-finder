import React from 'react';
import SearchArea from '../search-area';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { mockCharacters } from '../../../modules/mock-data';

afterEach(cleanup)

it('Typing in search box populates options list', () => {
    const { getByText, getByPlaceholderText, debug } = render(<SearchArea
        onSearch={() => null}
        searchDisabled={false}
        characters={mockCharacters} />);

    // debug();

    fireEvent.change(getByPlaceholderText(/Find a character/i), { target: { value: 'rick' } });

    expect(getByText('Rick Sanchez')).toBeInTheDocument();
    expect(getByText('Rick Prime')).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText(/Find a character/i), { target: { value: 'mo' } });

    expect(getByText('Morty Smith')).toBeInTheDocument();
    expect(getByText('Modern Rick')).toBeInTheDocument();

})