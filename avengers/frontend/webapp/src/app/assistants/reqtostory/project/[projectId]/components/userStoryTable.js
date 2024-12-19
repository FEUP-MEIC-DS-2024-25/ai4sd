import React from "react";

export default function UserStoryTable({
    userStories,
    editingStory,
    setUserStories,
    setEditingStory,
    tempContent,
    setTempContent,
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
                                    <button onClick={() => handleSaveEdit(story.index)}>
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
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
