export type User = {
  id: string;
  name: string;
  email: string;
};

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function loginUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("saved");
}

export function getSaved(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("saved");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function toggleSaved(collegeId: string): string[] {
  const saved = getSaved();
  const idx = saved.indexOf(collegeId);
  if (idx === -1) {
    saved.push(collegeId);
  } else {
    saved.splice(idx, 1);
  }
  localStorage.setItem("saved", JSON.stringify(saved));
  return saved;
}
