import React from "react";
import { ThumbsUp, ThumbsDown, Pencil, Trash2 } from "lucide-react";

export default function UserStoryTable({
    userStories,
    editingStory,
    setUserStories,
    setEditingStory,
    tempContent,
    setTempContent,
    queryAdders,
    projectId,
    reqVersion,
    userStoriesVersion
}) {
    const handleEditClick = (storyIndex) => {
        setEditingStory(storyIndex);
        setTempContent(userStories[storyIndex].user_story);
    };

    const handleCancelEdit = () => {
        setEditingStory(null);
        setTempContent("");
    };

    const handleSaveEdit = (index) => {
        if (!tempContent.trim()) return;
        setUserStories((prevStories) => {
            const updatedStories = [...prevStories];
            updatedStories[editingStory].user_story = tempContent;
            return updatedStories;
        });
        updateUserStoryContent(projectId, reqVersion, userStoriesVersion, index, tempContent)
        setEditingStory(null);
        setTempContent("");
    };

    const handleDelete = (index) => {
        setUserStories((prevStories) => {
            const updatedStories = [...prevStories];
            updatedStories.splice(index, 1);
            return updatedStories.map((story, idx) => ({
                ...story,
                index: idx + 1
            }));
        });
    };

    const handleLike = (index) => {
        const button = document.querySelector(`.like[data-index="${index}"]`);
        const isCurrentlyLiked = button.getAttribute('data-filled') === 'true';
        const dislikeButton = document.querySelector(`.dislike[data-index="${index}"]`);
        
        if (!isCurrentlyLiked) {
            button.setAttribute('data-filled', 'true');
            button.style.color = '#2f2f2f'; // filled
            
            if (dislikeButton.getAttribute('data-filled') === 'true') {
                dislikeButton.setAttribute('data-filled', 'false');
                dislikeButton.style.color = '#666';
            }
            
            queryAdders("like", index);
        } else {
            button.setAttribute('data-filled', 'false');
            button.style.color = '#666'; // unfilled
            queryAdders(null, index);
        }
    };

    const handleDislike = (index) => {
        const button = document.querySelector(`.dislike[data-index="${index}"]`);
        const isCurrentlyDisliked = button.getAttribute('data-filled') === 'true';
        const likeButton = document.querySelector(`.like[data-index="${index}"]`);
        
        if (!isCurrentlyDisliked) {
            button.setAttribute('data-filled', 'true');
            button.style.color = '#2f2f2f'; 
            
            if (likeButton.getAttribute('data-filled') === 'true') {
                likeButton.setAttribute('data-filled', 'false');
                likeButton.style.color = '#666';
            }
            
            queryAdders("dislike", index);
        } else {
            button.setAttribute('data-filled', 'false');
            button.style.color = '#666';
            queryAdders(null, index);
        }
    };
    ///////////////////////////////////////////////////////////////////////////////////////////
    const updateUserStoryContent = async (projectId, reqVersion, userStoriesVersion, index, content) => {
        try {
            const response = await fetch('http://localhost:8080/project/userstory/update', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_id: projectId,
                    req_version: reqVersion,
                    version: userStoriesVersion + 1,
                    index: index,
                    content: content,
                }),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            setError(`Failed to generate user stories:  ${error}.`);
            console.error(error);
        } 
    };

    const updateUserStoryFeedback = async (projectId, reqVersion, userStoriesVersion, index, feedback) => {
        try {
            const response = await fetch(`http://localhost:8080/project/userstory/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    project_id: projectId,
                    req_version: reqVersion,
                    version: userStoriesVersion + 1,
                    index: index,
                    feedback: feedback,
                }),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
        } catch (error) {
            setError(`Failed to generate user stories:  ${error}.`);
            console.error(error);
        } 
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////

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
                                    onChange={(e) => setTempContent(e.target.value)}
                                    rows={3}
                                />
                            ) : (
                                story.user_story
                            )}
                        </td>
                        <td className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
                            {editingStory === idx ? (
                                <>
                                    <button onClick={() => handleSaveEdit(story.index)}>
                                        Save
                                    </button>
                                    <button onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => handleEditClick(idx)}
                                        className="p-1"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button 
                                        className="text-red-600 hover:text-red-800 ml-2 p-1"
                                        onClick={() => handleDelete(idx)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </>
                            )}
                        </td>
                        <td className="min-h-[2em] min-w-[10em] text-center border border-[#e1e1e1] p-2">
                            <button
                                className="mx-2 like text-gray-600 hover:text-gray-800"
                                data-index={idx}
                                data-filled="false"
                                onClick={() => handleLike(idx)}
                            >
                                <ThumbsUp size={18} />
                            </button>

                            <button
                                className="mx-2 dislike text-gray-600 hover:text-gray-800"
                                data-index={idx}
                                data-filled="false"
                                onClick={() => handleDislike(idx)}
                            >
                                <ThumbsDown size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}