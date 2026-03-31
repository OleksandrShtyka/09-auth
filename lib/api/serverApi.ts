import axios from 'axios';
import { cookies } from 'next/headers';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';
import type { FetchNotesParams, FetchNotesResponse } from './clientApi';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

async function getHeaders() {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const headers = await getHeaders();
  const response = await axios.get(`${baseURL}/notes`, {
    params,
    headers,
  });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const headers = await getHeaders();
  const response = await axios.get(`${baseURL}/notes/${id}`, { headers });
  return response.data;
}

export async function getMe(): Promise<User> {
  const headers = await getHeaders();
  const response = await axios.get(`${baseURL}/users/me`, { headers });
  return response.data;
}

export async function checkSession(): Promise<{ success: boolean }> {
  const headers = await getHeaders();
  const response = await axios.get(`${baseURL}/auth/session`, { headers });
  return response.data;
}
