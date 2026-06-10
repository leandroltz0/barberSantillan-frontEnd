export interface Review {
  _id: string;
  name: string;
  stars: number;
  comentary: string;
  createdAt: string;
  __v: number;
}

export interface ReviewInput {
  name: string;
  stars: number;
  comentary: string;
}

const API = import.meta.env.PUBLIC_API_URL || '';

export async function getReviews(): Promise<Review[]> {
  const res = await fetch(`${API}/api/opiniones`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function postReview(comentary: ReviewInput): Promise<Review> {
  const res = await fetch(`${API}/api/opiniones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comentary),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Error ${res.status}: ${res.statusText}`);
  }
  return data;
}
