import React from "react";
import UserStoryTable from "./userStoryTable";

export default function GeneratedStoriesSection({
  userStories,
  setUserStories,
  editingStory,
  setEditingStory,
  tempContent,
  setTempContent,
}) {
  const downloadUserStories = () => {
    const blob = new Blob([JSON.stringify(userStories, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "user_stories.json";
    link.click();
  };

  return (
    userStories.length > 0 && (
      <section id="sectionUserStories" className="bg-[#171717] shadow-[0_0_20px_rgba(0,0,0,0.7)] text-center p-8 m-8 flex flex-col items-center gap-6">
        <h2 className="text-[#171717]">Generated User Stories</h2>
        <UserStoryTable
          userStories={userStories}
          editingStory={editingStory}
          setUserStories={setUserStories}
          setEditingStory={setEditingStory}
          tempContent={tempContent}
          setTempContent={setTempContent}
        />
        <div id="buttonContainer" className="text-[#171717]">
          <button id="exportButton" onClick={downloadUserStories}>
            Download Stories
          </button>
        </div>
      </section>
    )
  );
}
