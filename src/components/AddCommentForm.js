import React, {useState} from 'react';

const AddCommentForm = ({articleName, setArticleInfo}) => {

    const [username, setUserName] = useState(''); // Set to a null string to begin with
    const [commentText, setcommentText] = useState('');

    const addComment = async () => {

        const result = await fetch(`/api/articles/${articleName}/add-comment`, {
            // These are the options with which we change the parameters of our request

            method: 'post',
            
            // Since we will also send Comment and UserName with our request, we need a body tag as well
            // when send a request body, we seend to convert it to a string so that the server can parse it
            body: JSON.stringify({username, text: commentText }), // Our server is expecting a text property, not a commentText property

            // when we send a post request with a json body to the server, we need to include a header
            // this tells our server what kind of data we are sending and it allows to parse our request body correctly
            headers: {
                'Content-Type': 'application/json', 
            }
            
            // Now results contain the updated version of our articleInfo

        });

        const body = await result.json();

        setArticleInfo(body);

        // To clear the fields after hitting submit
        setUserName('');
        setcommentText('');
    }

    return(
        <div id="add-comment-form">

            <label>
                Name:
                <input type="text" value={username}
                    onChange={(event) => setUserName(event.target.value)}
                />
            </label>

            <label>
                Comment:
                <textarea rows="4" cols="50" value={commentText} 
                    onChange={(event) => setcommentText(event.target.value)}
                />
            </label>

            <button onClick={()=> addComment()}>Add Comment</button>

        </div>
    );

}

export default AddCommentForm;