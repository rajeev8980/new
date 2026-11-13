export type SessionUser = {
  id: string;
  email: string;
  name: string;
  handle: string;
  bio: string;
  premium: boolean;
  theme: string;
};

export type Session = { token: string; user: SessionUser };

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try {
    response = await fetch(path, { ...options, headers });
  } catch {
    throw new Error("Can’t reach New right now.");
  }
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export const api = {
  signin(email: string, password: string) {
    return request<Session>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  signup(name: string, email: string, password: string) {
    return request<Session>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },
  social(provider: string) {
    return request<Session>("/api/auth/social", {
      method: "POST",
      body: JSON.stringify({ provider }),
    });
  },
  forgot(email: string) {
    return request<{ ok: boolean }>("/api/auth/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
  me(token: string) {
    return request<{ user: SessionUser }>("/api/me", {}, token);
  },
  patchMe(token: string, patch: Partial<SessionUser>) {
    return request<{ user: SessionUser }>(
      "/api/me",
      { method: "PATCH", body: JSON.stringify(patch) },
      token,
    );
  },
  chats(token: string) {
    return request<{ chats: unknown; messages: Record<string, unknown[]> }>("/api/chats", {}, token);
  },
  sendMessage(
    token: string,
    threadId: string,
    body: { text?: string; kind?: string; photo?: string; duration?: string },
  ) {
    return request<{ message: { id: string } }>(
      `/api/threads/${threadId}/messages`,
      { method: "POST", body: JSON.stringify(body) },
      token,
    );
  },
  communities(token?: string | null) {
    return request<{ communities: { id: string; name: string; sub: string; count: string; created?: boolean }[] }>(
      "/api/communities",
      {},
      token,
    );
  },
  createCommunity(token: string, name: string, topic: string) {
    return request<{ community: { id: string; name: string; sub: string; count: string } }>(
      "/api/communities",
      { method: "POST", body: JSON.stringify({ name, topic }) },
      token,
    );
  },
  joinCommunity(token: string, id: string) {
    return request(`/api/communities/${encodeURIComponent(id)}/join`, { method: "POST" }, token);
  },
};
