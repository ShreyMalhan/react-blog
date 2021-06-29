// this component displays the article content

import React, {useState, useEffect} from 'react';
import ArticleContent from './article-content';
import ArticleList from '../components/ArticlesList';
import CommentList from '../components/CommentList';
import UpvotesSection from '../components/UpvotesSection';
import AddCommentForm from '../components/AddCommentForm';
import NotFoundPage from './NotFoundPage';

{/*match is a prop passed by react router to the component which contains some useful information like current URL etc. */}
const ArticlePage = ({match}) => {
    
    {/* Gets the name property from match which is passed to the ArticlePage component in App.js */}
    const name = match.params.name;

    {/* Finds the article from the ArticleContent array by its name  */}
    const article = ArticleContent.find(article => article.name === name);

    const [articleInfo, setArticleInfo] = useState({upvotes: 0, comments: []});

    // we need to fetch data from our database but fetch is an async function and useEffect doesnt allow async functions.
    // to work around it we create a function inside the useEffect and call it inside the useEffect only.
    useEffect(()=>{ 

        const fetchData = async () =>{
            const result = await fetch(`/api/articles/${name}`); // rest of the URL is in package.json to avoid the CORS
            const body = await result.json();
            console.log(body);
            setArticleInfo(body); // sets the state of articleInfo to body
        }
         fetchData();

    }, [name]); // the array as the second argument means that useEffect should look for those values inside the array and update the
    // component only if any of those value changes. For instance, if the value of name changes then the component will reload.
    // Passing an empty array as the second argument means the component should never update and not passing array at all can possibly
    // put the component in an infinite loop as useEffect could keep on reloading the component if we have some kind of logic in 
    // setState which keeps on feeding it data. For example: setArticleInfo({upvotes: Math.random() * 10}); will put the component 
    // in an infinite loop    

    if(!article) return <NotFoundPage />

    const otherArticle = ArticleContent.filter(article => article.name !== name);

    return (
        <> {/* React Fragment*/}
            <h1> {article.title} </h1>

            <UpvotesSection 
                articleName={name}
                upvotes={articleInfo.upvotes}
                setArticleInfo={setArticleInfo}
            />
            
            {/* maps each paragraph in the article to a p tag. 'map' requires a key for each element. */}
            {article.content.map((paragraph, key) => (
                <p key = {key}>{paragraph}</p>
            ))}

            <CommentList comments={articleInfo.comments} />
            <AddCommentForm articleName={name} setArticleInfo={setArticleInfo} />

            <h3>Related Articles:</h3>

            <ArticleList articles= {otherArticle} />
        </>
    );
}
export default ArticlePage