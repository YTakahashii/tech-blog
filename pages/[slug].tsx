import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { getAllPosts, getPostBySlug } from 'lib/api';
import { markdownToHtml } from 'lib/markdownToHtml';
import { Post } from 'src/types/Post';
import { replaceComponents } from 'lib/replaceComponents';

type StaticProps = {
  post: Partial<Post>;
};

type Params = {
  slug: string;
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const PostPage: NextPage<Props> = ({ post }) => {
  return (
    <>
      <article>{replaceComponents(post.content)}</article>
    </>
  );
};

export const getStaticProps: GetStaticProps<StaticProps, Params> = async ({ params }) => {
  const post = getPostBySlug(params.slug, [
    'title',
    'slug',
    'publishDate',
    'content',
    'coverImage',
    'excerpt',
    'ogImage',
  ]);

  const content = await markdownToHtml(post.content ?? '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false, // ISR
  };
};

export default PostPage;
