import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'remix';
import bedorcss from 'bedrocss/bedrocss.min.css';
import { guesses } from './guesses';

/**
 *
 */
export function meta() {
  return { title: 'New Remix App' };
}

/** @type {import('remix').LinksFunction} */
export const links = () => {
  return [{ rel: 'stylesheet', href: bedorcss }];
};

/** @type {import('remix').ActionFunction} */
export const action = async ({ request }) => {
  const body = await request.formData();
  guesses.push(body.get('guess'));
  return guesses;
};

/**
 *
 */
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
