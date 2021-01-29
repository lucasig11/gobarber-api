import { Router } from 'express';

const routes = Router();

interface UserData {
  "name": string,
  "age": number
}

let users: Array<UserData> = [];

routes.get('/users', (request, response) => response.json(users));


routes.post('/users', (request, response) =>{
  const { name, age } = request.body;

  const user: UserData = {
    "name": name,
    "age": age,
  }

  users.push(user);

  return response.json(user);
});

export default routes;
