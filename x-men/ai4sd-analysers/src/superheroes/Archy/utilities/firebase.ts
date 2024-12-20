import exp from "constants";

// Define the type for recent requests
export interface RecentRequest {
    id: string;
    mode: string;
  }

export async function fetchRecentRequests(): Promise<RecentRequest[]> {
    try {
      const response = await fetch('https://superhero-02-04-150699885662.europe-west1.run.app');
      const recentRequests: RecentRequest[] = await response.json(); // Ensure the data is typed as RecentRequest[]
      console.log('Recent Requests:', recentRequests);
      return recentRequests;
    } catch (error) {
      console.error('Failed to fetch recent requests:', error);
      return [];
    }
  }

  fetchRecentRequests();


  
 
  
  