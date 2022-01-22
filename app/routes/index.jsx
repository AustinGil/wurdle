import styles from './index.css';

/** @type {import('remix').LinksFunction} */
export const links = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

const wurdle = 'trout';

// eslint-disable-next-line unicorn/no-new-array
const guesses = new Array(6).fill().map(() => new Array(5).fill('N'));

/**
 *
 */
export default function Index() {
  return (
    <div>
      <h1>Wurdle</h1>
      {guesses.map((letters, guessIndex) => (
        <div key={guessIndex} class="grid columns-6">
          {letters.map((letter, letterIndex) => (
            <div key={letterIndex}>{letter}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
