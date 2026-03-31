import api from './api';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const response = await api.get('/notes', { params });
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get(`/notes/${id}`);
  return response.data;
}

export async function createNote(noteData: CreateNoteData): Promise<Note> {
  const response = await api.post('/notes', noteData);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await api.delete(`/notes/${noteId}`);
  return response.data;
}

export async function register(data: RegisterData): Promise<User> {
  const response = await api.post('/auth/register', data);
  return response.data;
}

export async function login(data: LoginData): Promise<User> {
  const response = await api.post('/auth/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<{ success: boolean }> {
  const response = await api.get('/auth/session');
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get('/users/me');
  return response.data;
}

export async function updateMe(data: Partial<User>): Promise<User> {
  const response = await api.patch('/users/me', data);
  return response.data;
}
