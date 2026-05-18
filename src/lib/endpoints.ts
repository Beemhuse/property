export const ENDPOINTS = {
  SPACES: {
    LIST: "/api/spaces",
    LIKE: (id: string) => `/api/spaces/${id}/like`,
  }
};
