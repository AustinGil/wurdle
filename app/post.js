// eslint-disable-next-line unicorn/prefer-node-protocol
import path from 'path';
// eslint-disable-next-line unicorn/prefer-node-protocol
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';

/**
 * @typedef {{
 * slug: string;
 * title: string;
 * }} Post
 */

/**
 * @typedef {{
 * title: string;
 * }} PostMarkdownAttributes
 */

const postsPath = path.join(__dirname, '..', 'posts');

/**
 * @param {any} attributes
 * @returns {PostMarkdownAttributes}
 */
function isValidPostAttributes(attributes) {
  return attributes?.title;
}

/**
 *
 */
export async function getPosts() {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes } = parseFrontMatter(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.replace(/\.md$/, ''),
        title: attributes.title,
      };
    })
  );
}

/**
 * @param {string} slug
 */
export async function getPost(slug) {
  const filepath = path.join(postsPath, slug + '.md');
  const file = await fs.readFile(filepath);
  const { attributes } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );
  return { slug, title: attributes.title };
}
