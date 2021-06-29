import React from 'react';

const UpvotesSection = ({articleName, upvotes, setArticleInfo}) => {

    const upvoteArticle = async () =>{

        const result = await fetch(`/api/articles/${articleName}/upvote`, {
            method: 'post' // to determine this request as a POST request. By default, it is a GET request
        });
        // Now results contain the updated version of our articleInfo

        const body = await result.json();

        setArticleInfo(body);
    }

    return(
        <div id="upvotes-section">
            <button onClick={ () => upvoteArticle() }>Add Upvote</button>

            <p> This article has been upvotes {upvotes} times! </p>
        </div>
    );

}

export default UpvotesSection;