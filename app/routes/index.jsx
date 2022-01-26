import { useLoaderData } from 'remix';
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

// const [currentGuess, setCurrentGuess] = useState('');

/**
 *
 */
export default function Index() {
  const guesses = useLoaderData();
  const guessesGrid = Array.from({ length: 6 }, (_, index) => {
    return guesses[index] || Array.from({ length: 5 }, () => '');
  });

  return (
    <div>
      <h1>Wurdle</h1>
      <div className="grid gap-4 columns-5">
        {guessesGrid.map((letters) => (
          <>
            {letters.map((letter, letterIndex) => (
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
          </>
        ))}
      </div>

      <form method="POST">
        <label htmlFor="guess">
          What's your guess?
          <input
            id="guess"
            name="guess"
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
