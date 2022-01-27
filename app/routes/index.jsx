import { useLoaderData } from 'remix';
import { useState } from 'react';
import styles from '../assets/styles/main.css';
import { guesses } from '../guesses';

/** @type {import('remix').LinksFunction} */
export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

/**
 *
 */
export function loader() {
  return guesses;
}

let wurdle = 'trout';

/**
 *
 */
export default function Index() {
  const previousGuesses = useLoaderData();

  const [currentGuess, setCurrentGuess] = useState(Array.from({ length: 5 }));

  const [remainingGuesses, setRemainingGuess] = useState(
    Array.from({ length: 5 - previousGuesses.length })
  );

  // Update the current guess data to the guess input
  const handleChange = (event) => {
    const value = event.target.value;
    const newGuess = Array.from({ length: 5 }, (_, index) => {
      return value[index] || '';
    });
    setCurrentGuess(newGuess);
  };

  return (
    <div>
      <h1>Wurdle</h1>
      <div className="grid gap-4 columns-5">
        {previousGuesses.map((guess, guessIndex) => (
          <React.Fragment key={guessIndex}>
            {guess.map((letter, letterIndex) => (
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

        {currentGuess.map((letter, letterIndex) => (
          <div key={letterIndex} className="letter p-4">
            {letter}
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
            value={currentGuess.join('')}
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
