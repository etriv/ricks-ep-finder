import React from 'react';
import App from './App';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { mockCharacters, mockEpisodes } from './modules/mock-data';
import { getEpisodes, getAllCharactersInPage } from './modules/rick-manager';

// Mocking API calls
jest.mock('./modules/rick-manager');
getAllCharactersInPage.mockResolvedValue({ characters: mockCharacters, numOfPages: 1 });
getEpisodes.mockResolvedValue(mockEpisodes);

afterEach(cleanup);

it('Shows results when searching for existing character', async () => {
  const { getByText, getByPlaceholderText, debug, findByText } = render(<App />);

  fireEvent.change(getByPlaceholderText(/Find a character/i), { target: { value: 'rick' } });

  // Testing that name options populate
  const option1 = await findByText('Rick Sanchez');
  expect(option1).toBeInTheDocument();
  expect(getByText('Rick Prime')).toBeInTheDocument();

  // Testing that results are showing when the user presses SEARCH
  fireEvent.change(getByPlaceholderText(/Find a character/i), { target: { value: 'Rick Sanchez' } });
  const searchButton = getByText('SEARCH');
  fireEvent.click(searchButton);

  // Making sure episodes are being displayed
  const episode1 = await findByText(/Pilot/i);
  expect(episode1).toBeInTheDocument();
  expect(getByText(/A Rickle in Time/i)).toBeInTheDocument();

  // Making sure species recommendations are being displayed:
  expect(getByText(/Summer Smith/i)).toBeInTheDocument();
  expect(getByText(/Albert Einstein/i)).toBeInTheDocument();
});

it('Shows a warning message when searching for a non-existing character', async () => {
  const { getByText, getByPlaceholderText, debug, findByText } = render(<App />);

  fireEvent.change(getByPlaceholderText(/Find a character/i), { target: { value: 'non-existing character' } });
  const searchButton = getByText('SEARCH');
  fireEvent.click(searchButton);

  // Making sure episodes are being displayed
  const warningMsg = await findByText(/choose an existing character/i);
  expect(warningMsg).toBeInTheDocument();
});