import { useLoaderData } from 'remix';
import { useState } from 'react';
import styles from '../assets/styles/main.css';
import { getSession, commitSession } from '../sessions.js';
import { guesses } from '../guesses';

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

  if (!session.has('guesses')) {
    session.set('guesses', []);
    await commitSession(session);
  }

  // return json(guesses, {
  //   headers: {
  //     'Set-Cookie': await commitSession(session),
  //   },
  // });

  return guesses;
}

let wurdle = 'trout';

/**
 *
 */
export default function Index() {
  /** @type {string[]} */
  const previousGuesses = useLoaderData();

  const [currentGuess, setCurrentGuess] = useState('');

  const remainingGuesses = Array.from({ length: 5 - previousGuesses.length });

  // Update the current guess data to the guess input
  const handleChange = (event) => {
    setCurrentGuess(event.target.value);
  };

  return (
    <div>
      <h1>Wurdle</h1>
      <div className="grid gap-4 columns-5">
        {previousGuesses.map((guess, guessIndex) => (
          <React.Fragment key={guessIndex}>
            {guess.split('').map((letter, letterIndex) => (
              <div
                key={letterIndex}
                className={`letter p-4 ${
                  !letter
                    ? ''
                    : (wurdle[letterIndex] === letter
                    ? 'bg-green'
                    : wurdle.includes(letter)
                    ? 'bg-yellow'
                    : 'bg-grey')
                }`}
              >
                {letter}
              </div>
            ))}
          </React.Fragment>
        ))}

        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="letter p-4">
            {currentGuess[index] || ''}
          </div>
        ))}

        {remainingGuesses.map((_, index) => (
          <React.Fragment key={index}>
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="letter p-4"></div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <form method="POST">
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
    </div>
  );
}
