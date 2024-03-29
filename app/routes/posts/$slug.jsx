import { useLoaderData } from 'remix';
import invariant from 'tiny-invariant';
import { getPost } from '../../post';

/** @type {import('remix').LoaderFunction} */
export const loader = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');
  return getPost(params.slug);
};

export default function PostSlug() {
  const post = useLoaderData();
  return (
    <div>
      <h1>{post.title}</h1>
    </div>
  );
}
