import { createCookieSessionStorage } from 'remix';

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: 'guesses',
      // expires: new Date(Date.now() + 60),
      httpOnly: true,
      // maxAge: 60,
      sameSite: 'strict',
      // secure: true,
    },
  });

export { getSession, commitSession, destroySession };
