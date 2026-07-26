const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
};

export const api = {
  auth: {
    login: (username, password) => request("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
    register: (username, password) => request("/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
    getMe: (token) => request("/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),
  },
  scores: {
    create: (scoreData, token) => request("/scores", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(scoreData),
    }),
    getMyScores: (token) => request("/scores/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }),
    getLeaderboard: () => request("/leaderboard", {
      method: "GET",
    }),
  },
  ai: {
    generate: (params) => request("/generate", {
      method: "POST",
      body: JSON.stringify(params),
    }),
  },
};
