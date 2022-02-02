import { useLoaderData, json } from 'remix';
import { useState } from 'react';
import styles from '../assets/styles/main.css';
import { getSession, commitSession } from '../sessions.js';
import { getWordOfTheDay } from '../words.js';

/** @type {import('remix').LinksFunction} */
export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

/**
 * @param root0
 * @param root0.request
 */
export async function loader({ request }) {
  const session = await getSession(request.headers.get('Cookie'));
  let previousGuesses = [];

  if (session.has('guesses')) {
    previousGuesses = session.get('guesses');
  }
  session.set('guesses', previousGuesses);
  const errorMessage = session.get('errorMessage') || null;
  const successMessage = session.get('successMessage') || null;

  const data = {
    errorMessage,
    successMessage,
    previousGuesses,
  };
  return json(data, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

const wordOfTheDay = getWordOfTheDay();

/**
 *
 */
export default function Index() {
  /** @type {{ previousGuesses: string[], errorMessage: string, successMessage: string }} */
  const { previousGuesses, errorMessage, successMessage } = useLoaderData();

  const [currentGuess, setCurrentGuess] = useState('');

  const remainingGuesses = Array.from({ length: 5 - previousGuesses.length });
  const hasWon = previousGuesses.at(-1) === wordOfTheDay;
  const hasMoreGuesses = !hasWon && remainingGuesses.length > 0;
  const hasLost = !hasWon && !hasMoreGuesses;

  // Update the current guess data to the guess input
  const handleChange = (event) => {
    setCurrentGuess(event.target.value);
  };

  return (
    <div>
      <h1>Wurdle</h1>

      {errorMessage && <p className="color-red">{errorMessage}</p>}
      {hasLost && (
        <p className="color-red">Sorry chump. Better luck next time.</p>
      )}
      {hasWon && (
        <p className="color-green">Nice! You got it. Come back tomorrow!</p>
      )}

      <ul className="board grid gap-4 place-center margin-y-48 p-0">
        {previousGuesses.map((guess, guessIndex) => (
          <li key={guessIndex} className="word grid gap-4">
            {guess.split('').map((letter, letterIndex) => (
              <span
                key={letterIndex}
                className={`grid place-center p-4 ${
                  !letter
                    ? ''
                    : wordOfTheDay[letterIndex] === letter
                    ? 'bg-green'
                    : wordOfTheDay.includes(letter)
                    ? 'bg-yellow'
                    : 'bg-grey'
                }`}
              >
                {letter}
              </span>
            ))}
          </li>
        ))}

        {hasMoreGuesses && (
          <li className="word grid gap-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="unknown-letter grid place-center p-4">
                {currentGuess[index] || ''}
              </div>
            ))}
          </li>
        )}

        {remainingGuesses.map((_, index) => (
          <li key={index} className="word grid gap-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="unknown-letter p-4"></div>
            ))}
          </li>
        ))}
      </ul>

      {!hasWon && (
        <form method="POST" className="visually-hidden">
          <label htmlFor="guess">
            What's your guess?
            <input
              id="guess"
              name="guess"
              value={currentGuess}
              onChange={handleChange}
              autoFocus
              minLength={5}
              maxLength={5}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}
