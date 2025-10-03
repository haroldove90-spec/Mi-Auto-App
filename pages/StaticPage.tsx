import React from 'react';

interface StaticPageProps {
  title: string;
  content: string;
}

const StaticPage: React.FC<StaticPageProps> = ({ title, content }) => {
  return (
    <div className="bg-white min-h-full py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 border-b pb-4">{title}</h1>
        <div 
            className="prose lg:prose-xl max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
        >
        </div>
      </div>
    </div>
  );
};

export default StaticPage;