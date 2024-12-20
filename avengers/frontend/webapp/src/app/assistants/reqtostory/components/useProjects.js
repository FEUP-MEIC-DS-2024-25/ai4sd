import React, { useEffect, useState, useCallback} from 'react';

const useProjects = ({update, setUpdate}) => {
  const [error, setError] = useState("");
  const [projects, setProjects] = useState([]);


  useEffect(() => {
    fetchProjects();
  },[]);

  useEffect(() => {
    if(update) {
      fetchProjects();
      setUpdate(false)}
  }, [update]);

  //http://localhost:8080/projects
  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("https://superhero-04-02-150699885662.europe-west1.run.app/projects");
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();
      let projectsList = []
      data.response.forEach(project => {
        const chat = { text: project.name, link: `/assistants/reqtostory/project/${project.id}?name=${encodeURIComponent(project.name)}` };
        projectsList.push(chat)
      });
      setProjects(projectsList);
    } catch (error) {
      console.error(error);
      setError("Failed to load projects.");
    }
  },[]);

  return projects
};

export default useProjects;
