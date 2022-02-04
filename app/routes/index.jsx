import { useLoaderData, json } from 'remix';
import { useState } from 'react';
import styles from '../assets/styles/main.css';
import { getSession, commitSession } from '../sessions.js';
import { getWordOfTheDay } from '../words.js';
import keyboardRows from '../keyboardRows.js';

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
  const errorMessage = session.get('errorMessage') || undefined;

  const data = {
    errorMessage,
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
  /** @type {{ previousGuesses: string[], errorMessage: string }} */
  const { previousGuesses, errorMessage } = useLoaderData();

  const [currentGuess, setCurrentGuess] = useState('');

  const remainingGuesses = Array.from({ length: 6 - previousGuesses.length });
  const hasWon = previousGuesses.at(-1) === wordOfTheDay;
  const hasMoreGuesses = !hasWon && remainingGuesses.length > 0;
  const hasLost = !hasWon && !hasMoreGuesses;

  // Update the current guess data to the guess input
  const handleChange = (event) => {
    setCurrentGuess(event.target.value);
  };

  const keyboard = keyboardRows.map((row) => {
    return row.split('').map((letter) => {
      let status = 'UNUSED';
      for (const guess of previousGuesses) {
        if (wordOfTheDay.includes(letter)) {
          if (guess.indexOf(letter) === wordOfTheDay.indexOf(letter)) {
            status = 'CORRECT';
            break;
          }
          if (guess.includes(letter)) {
            status = 'CLOSE';
            continue;
          }
        } else if (guess.includes(letter)) {
          status = 'WRONG';
          continue;
        }
      }
      return {
        key: letter,
        status,
      };
    });
  });

  return (
    <main className="max-w-480 margin-x-auto">
      <h1>Wurdle</h1>

      {errorMessage && (
        <p className="color-red" role="alert">
          {errorMessage}
        </p>
      )}
      {hasLost && (
        <p className="color-red" role="alert">
          Sorry chump. Better luck next time.
        </p>
      )}
      {hasWon && (
        <p className="color-green" role="alert">
          Nice! You got it. Come back tomorrow!
        </p>
      )}

      <ul className="board grid gap-4 place-center margin-y-48 padding-0">
        {previousGuesses.map((guess, guessIndex) => (
          <li key={guessIndex} className="word grid gap-4">
            {guess.split('').map((letter, letterIndex) => (
              <span
                key={letterIndex}
                className={`grid place-center padding-4 ${
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

        {remainingGuesses.map((_, rowIndex) => (
          <li key={rowIndex} className="word grid gap-4">
            {Array.from({ length: 5 }, (_, letterIndex) => (
              <span
                key={letterIndex}
                className="unknown-letter grid place-center padding-4"
              >
                {(rowIndex === 0 && currentGuess[letterIndex]) || ''}
              </span>
            ))}
          </li>
        ))}
      </ul>

      {hasMoreGuesses && (
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

      <div className="grid gap-4 justify-center">
        {keyboard.map((row, index) => (
          <ul
            key={index}
            className="flex gap-4 wrap justify-center margin-0 padding-0"
          >
            {row.map((letter) => (
              <li key={letter.key} className="grid place-center">
                <button
                  data-status={letter.status}
                  className={`key ${
                    letter.status === 'CORRECT'
                      ? 'bg-green'
                      : letter.status === 'CLOSE'
                      ? 'bg-yellow'
                      : letter.status === 'WRONG'
                      ? 'bg-red'
                      : 'bg-grey'
                  }`}
                >
                  {letter.key}
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </main>
  );
}
