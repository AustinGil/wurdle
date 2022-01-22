import { Link, useLoaderData } from 'remix';
import { getPosts } from '../../post.js';

/**
 * @typedef {import('../../post').Post } Post
 */

export const loader = () => {
  return getPosts();
};

/**
 *
 */
export default function Posts() {
  /** @type {Post[]} */
  const posts = useLoaderData();
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
