import React from "react";

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

  return (
    <table id="userStoriesTable" className="bg-[#e1e1e1] p-4 w-full">
      <thead>
        <tr>
          <th className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">Index</th>
          <th className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">User Story</th>
          <th className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {userStories.map((story, idx) => (
          <tr key={idx}>
            <td className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">{story.index}</td>
            <td className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
              {editingStory === idx ? (
                <textarea
                  id="editUserStory"
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  rows={3}
                  className="w-full"
                />
              ) : (
                story.user_story
              )}
            </td>
            <td className="min-h-[2em] min-w-[3em] text-center border border-[#e1e1e1] p-2">
              {editingStory === idx ? (
                <>
                  <button onClick={handleSaveEdit}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <button onClick={() => handleEditClick(idx)}>Edit</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
