import dotenv from 'dotenv';

dotenv.config();

const apiUrl = process.env.API_URL as string;

const HEADER = {
  'content-type': 'application/json',
  apikey: process.env.API_KEY,
  username: process.env.USER_NAME,
};

function createRequest(type: string, data) {
  const request = { method: type, headers: HEADER };
  if (data) request.body = JSON.stringify(data);
  return request;
}

export async function getListTodo() {
  const res = await fetch(apiUrl, createRequest('GET'));
  return await res.json();
}

export async function insertTodo(title: string, order: number) {
  await fetch(apiUrl, createRequest('POST', { title, order }));
}

export async function updateTodo({ id, title, done, order }) {
  const res = await fetch(apiUrl + `/${id}`, createRequest('PUT', { title, done, order }));
}

export async function deleteTodo(id: string) {
  await fetch(apiUrl + `/${id}`, createRequest('DELETE'));
}

export async function deleteListTodo(ids: string[]) {
  for (let id of ids) {
    await fetch(apiUrl + `/${id}`, createRequest('DELETE'));
  }
}

export async function reorderTodo(todoIds) {
  await fetch(apiUrl + `/reorder`, createRequest('PUT', { todoIds }));
}
