import Head from 'next/head';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description, keywords }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || ''} />
      <meta name="author" content="vendamode" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

export default MetaTags;
