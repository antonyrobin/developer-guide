import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import { slugify } from '../../data/courses';

const textOf = (children) =>
  React.Children.toArray(children)
    .map(child => (typeof child === 'string' || typeof child === 'number' ? child : textOf(child?.props?.children)))
    .join('');

const heading = (Tag, className) => {
  const Heading = ({ node: _node, children, ...props }) => (
    <Tag id={slugify(textOf(children))} className={className} {...props}>{children}</Tag>
  );
  return Heading;
};

const components = {
  h1: heading('h2', 'content-subheading-lg'),
  h2: heading('h2', 'content-subheading-lg'),
  h3: heading('h3', 'content-subheading'),
  h4: heading('h4', 'content-subheading-sm'),
  p: ({ node: _node, ...props }) => <p className="course-paragraph" {...props} />,
  ul: ({ node: _node, ...props }) => <ul className="course-list" {...props} />,
  ol: ({ node: _node, ...props }) => <ol className="course-list course-list--ordered" {...props} />,
  a: ({ node: _node, href = '', ...props }) => {
    const external = /^https?:\/\//.test(href);
    return <a className="content-link" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props} />;
  },
  blockquote: ({ node: _node, ...props }) => <blockquote className="content-callout" {...props} />,
  table: ({ node: _node, ...props }) => (
    <div className="content-table-wrap" tabIndex={0}>
      <table className="content-table" {...props} />
    </div>
  ),
  hr: () => <hr className="content-divider" />,
  // Fenced blocks arrive as <pre><code class="language-x">; render them with the shared CodeBlock.
  pre: ({ node: _node, children }) => {
    const child = React.Children.toArray(children)[0];
    const className = child?.props?.className || '';
    const match = /language-([\w#+-]+)/.exec(className);
    return <CodeBlock code={textOf(child?.props?.children)} language={match ? match[1].toLowerCase() : 'text'} />;
  },
  code: ({ node: _node, className: _className, ...props }) => <code className="inline-code" {...props} />,
  img: ({ node: _node, alt = '', ...props }) => (
    <figure className="course-image-container">
      <img className="course-image" alt={alt} loading="lazy" decoding="async" {...props} />
      {alt && <figcaption className="course-image-caption">{alt}</figcaption>}
    </figure>
  ),
};

const Markdown = ({ children }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
    {children}
  </ReactMarkdown>
);

export default Markdown;
