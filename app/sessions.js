import { createCookieSessionStorage } from 'remix';

const today = new Date();
today.setHours(0, 0, 0, 0);

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: 'guesses',
      expires: new Date(today.getTime() + 1000 * 60 * 60 * 24),
      httpOnly: true,
      // maxAge: 60,
      sameSite: 'strict',
      // secure: true,
    },
  });

export { getSession, commitSession, destroySession };
