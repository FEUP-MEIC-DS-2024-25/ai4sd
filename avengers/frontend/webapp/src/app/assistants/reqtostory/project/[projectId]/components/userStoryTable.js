import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function UserStoryTable({
    userStories,
    editingStory,
    setUserStories,
    setEditingStory,
    tempContent,
    setTempContent,
}) {
    const handleEditClick = (storyIndex) => {
        setEditingStory(storyIndex);
        setTempContent(userStories[storyIndex].user_story);
    };

    const handleCancelEdit = () => {
        setEditingStory(null);
        setTempContent("");
    };

    const handleSaveEdit = () => {
        if (!tempContent.trim()) return;
        setUserStories((prevStories) => {
            const updatedStories = [...prevStories];
            updatedStories[editingStory].user_story = tempContent;
            return updatedStories;
        });
        setEditingStory(null);
        setTempContent("");
    };

    const handleLike = () => {
        const likeButton = document.querySelector('.like');
        if(likeButton.classList.contains('not-filled')){
            likeButton.classList.remove('not-filled');
            likeButton.classList.add('filled');
            likeButton.children[0].classList.remove('far');
            likeButton.children[0].classList.add('fas');
        } else {
            likeButton.classList.remove('filled');
            likeButton.classList.add('not-filled');
            likeButton.children[0].classList.remove('fas');
            likeButton.children[0].classList.add('far');
        }
    }

    const handleDislike = () => {
        const dislikeButton = document.querySelector('.dislike');
        if(dislikeButton.classList.contains('not-filled')){
            dislikeButton.classList.remove('not-filled');
            dislikeButton.classList.add('filled');
            dislikeButton.children[0].classList.remove('far');
            dislikeButton.children[0].classList.add('fas');
        } else {
            dislikeButton.classList.remove('filled');
            dislikeButton.classList.add('not-filled');
            dislikeButton.children[0].classList.remove('fas');
            dislikeButton.children[0].classList.add('far');
        }
    }

    return (
        <table className="bg-[#e1e1e1] text-[#2f2f2f] p-4 m-auto w-[90%]">
            <thead>
                <tr>
                    <th className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
                        Index
                    </th>
                    <th className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
                        User Story
                    </th>
                    <th className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
                        Actions
                    </th>
                    <th className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
                        Feedback
                    </th>
                </tr>
            </thead>
            <tbody>
                {userStories.map((story, idx) => (
                    <tr key={idx}>
                        <td className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
                            {story.index}
                        </td>
                        <td className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
                            {editingStory === idx ? (
                                <textarea
                                    className="bg-[#2f2f2f] text-[#e1e1e1] border-4 border-[#2f2f2f] rounded-[20px] m-2 p-2 w-[100%] resize-none"
                                    value={tempContent}
                                    onChange={(e) =>
                                        setTempContent(e.target.value)
                                    }
                                    rows={3}
                                />
                            ) : (
                                story.user_story
                            )}
                        </td>
                        <td className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
                            {editingStory === idx ? (
                                <>
                                    <button onClick={handleSaveEdit}>
                                        Save
                                    </button>
                                    <button onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => handleEditClick(idx)}>
                                    Edit
                                </button>
                            )}
                        </td>
                        <td className="min-h-[2em] min-w-[10em] text-center border border-[#e1e1e1] p-2">
                            <button className="mx-2 like not-filled" onClick={() => handleLike()}>
                                <i className="far fa-thumbs-up"></i>
                            </button>

                            <button className="mx-2 dislike not-filled" onClick={() => handleDislike()}>
                                <i className="far fa-thumbs-down"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
