interface SpaceCreateData {
  title: string;
  description?: string;
  tags?: string[];
  privacy?: 'public' | 'private';
  quality_threshold?: number;
  scheduled_time?: string;
  is_live?: boolean;
  cover_image_url?: string;
}

interface Space {
  id: string;
  title: string;
  description: string;
  host_id: string;
  tags: string[];
  privacy: string;
  quality_threshold: number;
  scheduled_time?: string;
  is_live: boolean;
  cover_image_url?: string;
  participant_count: number;
  listener_count: number;
  duration: number;
  created_at: string;
  updated_at: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

export const spacesApi = {
  async createSpace(spaceData: SpaceCreateData, hostId: string): Promise<Space> {
    const response = await fetch(`${BACKEND_URL}/api/spaces?host_id=${hostId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spaceData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create space: ${response.statusText}`);
    }

    return response.json();
  },

  async getSpaces(): Promise<Space[]> {
    const response = await fetch(`${BACKEND_URL}/api/spaces`);

    if (!response.ok) {
      throw new Error(`Failed to fetch spaces: ${response.statusText}`);
    }

    return response.json();
  },

  async getSpace(spaceId: string): Promise<Space> {
    const response = await fetch(`${BACKEND_URL}/api/spaces/${spaceId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch space: ${response.statusText}`);
    }

    return response.json();
  },

  async updateSpace(spaceId: string, spaceData: Partial<SpaceCreateData>, hostId: string): Promise<Space> {
    const response = await fetch(`${BACKEND_URL}/api/spaces/${spaceId}?host_id=${hostId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spaceData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update space: ${response.statusText}`);
    }

    return response.json();
  },

  async deleteSpace(spaceId: string, hostId: string): Promise<void> {
    const response = await fetch(`${BACKEND_URL}/api/spaces/${spaceId}?host_id=${hostId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete space: ${response.statusText}`);
    }
  },
};

export type { Space, SpaceCreateData };