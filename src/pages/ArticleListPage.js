// This is the Articles page

import React from 'react';
import ArticleContent from './article-content';
import ArticleList from '../components/ArticlesList';

const ArticleListPage = () => (
    <> {/* React Fragment*/}
        <h1>Articles</h1>

        {/* Calls the Article list displaying component */}
        <ArticleList articles={ArticleContent} />
    </>
);

export default ArticleListPage