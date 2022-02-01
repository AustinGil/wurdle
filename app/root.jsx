import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
} from 'remix';
import bedorcss from 'bedrocss/bedrocss.min.css';
import { getSession, commitSession } from './sessions';

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
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('guesses')) {
      return redirect('/');
  }

  const body = await request.formData();
  const guesses = session.get('guesses');
  guesses.push(body.get('guess'));
  session.set('guesses', guesses);

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
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
