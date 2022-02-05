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

export { action } from './routes/index.jsx';

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
      <body className="grid justify-center padding-4">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
