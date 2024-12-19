import React, { useEffect, useState } from "react";
import axios from "axios";
import AssistantHistory from "@/app/components/assistantHistory";


const BASE_URL = "https://superhero-06-02-150699885662.europe-west1.run.app/";

function Sidebar({ openChat, chatId }) {
  const [sessions, setSessions] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/app/get_sessions/`)
      .then((response) => {
        // sort sessions by most recent activity first
        response.data.sort(
          (a, b) => new Date(b.last_activity) - new Date(a.last_activity)
        );
        setSessions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      });
  }, []);

  const deleteSession = async (sessionId) => {
    console.log("Deleting session:", sessionId);
    try {
      await axios.post(`${BASE_URL}/app/delete_session/`, {
        session_id: sessionId,
      });
      setSessions(
        sessions.filter((session) => session.session_id !== sessionId)
      );
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  const renameSession = async (sessionId, newName) => {
    try {
      await axios.post(`${BASE_URL}/app/update_session_name/`, {
        session_id: sessionId,
        name: newName,
      });
      setSessions(
        sessions.map((session) =>
          session.session_id === sessionId
            ? { ...session, name: newName }
            : session
        )
      );
    } catch (error) {
      console.error("Error renaming session:", error);
    }
  };

  const createSession = async () => {
    try {
      // Inform the user that a new session is being created

      const response = await axios.post(`${BASE_URL}/app/create_session/`);
      const newSession = response.data.session;
      setSessions([newSession, ...sessions]);
      openChat(newSession.session_id);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const interactions = sessions.map((session) => ({
    text: session.name,
    link: () => openChat(session.session_id),
  }));

  return (
    // <div className="flex flex-col items-center justify-center h-screen w-64 bg-gray-100 p-4 border-r border-gray-300">
       <div>
        <button
          className="mt-4 p-2 rounded"
          onClick={async () => {
            setIsCreating(true);
            await createSession();
            setIsCreating(false);
          }}
          disabled={isCreating}
        >
          {isCreating ? "Creating Session..." : "Create New Session"}
        </button>

        <AssistantHistory
          name="Diagram Detective"
          type="arch"
          interactions={interactions}
        />
        <ul className="list-none p-0 w-full">
          {sessions.map((session, index) => (
            <li
              key={index}
              className="mb-2 w-full flex items-center"
              style={{ listStyleType: "none" }}
            >
              <button
                className={`flex-grow text-left p-2 border border-gray-300 rounded hover:bg-gray-200 `}
                onClick={() => openChat(session.session_id)}
              >
                {session.name}
              </button>
              <button
                className="ml-2 p-2 bg-red-500 rounded hover:bg-red-700"
                onClick={() => deleteSession(session.session_id)}
              >
                Delete
              </button>
              <button
                className="ml-2 p-2 rounded"
                onClick={() => {
                  const newName = prompt(
                    "Enter new session name:",
                    session.name
                  );
                  if (newName) {
                    renameSession(session.session_id, newName);
                  }
                }}
              >
                Rename
              </button>
            </li>
          ))}
        </ul>

      </div>
    // </div>
  );
}

export default Sidebar;
