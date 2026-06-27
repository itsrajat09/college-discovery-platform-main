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
  
}
 
export async function fetchSavedIds(): Promise<string[]> {
  const user = getUser();
  if (!user) return [];
  try {
    const res = await fetch("/api/saved", {
      headers: { "x-user-id": user.id },
    });
    if (!res.ok) return [];
    const colleges = await res.json();
    return (colleges as { id: string }[]).map((c) => c.id);
  } catch {
    return [];
  }
}

export async function saveCollege(collegeId: string): Promise<boolean> {
  const user = getUser();
  if (!user) return false;
  const res = await fetch("/api/saved", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, collegeId }),
  });
  return res.ok;
}

export async function unsaveCollege(collegeId: string): Promise<boolean> {
  const user = getUser();
  if (!user) return false;
  const res = await fetch("/api/saved", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, collegeId }),
  });
  return res.ok;
}

export async function toggleSavedDB(collegeId: string, currentlySaved: boolean): Promise<boolean> {
  if (currentlySaved) {
    await unsaveCollege(collegeId);
    return false;
  } else {
    await saveCollege(collegeId);
    return true;
  }
}
