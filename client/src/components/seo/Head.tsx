type HeadProps = {
  title?: string;
  description?: string;
};

export const Head = ({ title = '', description = '' }: HeadProps = {}) => {
  // Handle the title logic directly
  const pageTitle = title ? `${title} | Bulletproof React` : 'Bulletproof React';

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
    </>
  );
};