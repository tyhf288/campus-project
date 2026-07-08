/* eslint-disable */
export default async () => {
  const t = {
    ['./todos/entities/todo.entity']: await import('./todos/entities/todo.entity'),
  }
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./todos/dto/create-todo.dto'),
          {
            CreateTodoDto: {
              title: { required: true, type: () => String },
              content: { required: true, type: () => String },
              isComplete: { required: true, type: () => Boolean },
            },
          },
        ],
        [import('./todos/dto/update-todo.dto'), { UpdateTodoDto: {} }],
        [
          import('./todos/entities/todo.entity'),
          {
            Todo: {
              id: { required: true, type: () => Number },
              title: { required: true, type: () => String },
              content: { required: true, type: () => String },
              isComplete: { required: true, type: () => Boolean },
            },
          },
        ],
        [
          import('./todos/dto/allFilter-todo.dto'),
          {
            AllFilterTodoDto: {
              page: { required: true, type: () => Number },
              limit: { required: true, type: () => Number },
              order: { required: false, enum: ['asc', 'desc'] },
            },
          },
        ],
        [import('./users/dto/create-user.dto'), { CreateUserDto: {} }],
        [import('./users/dto/update-user.dto'), { UpdateUserDto: {} }],
        [import('./users/entities/user.entity'), { User: {} }],
      ],
      controllers: [
        [import('./app.controller'), { AppController: { getHello: { type: String } } }],
        [
          import('./todos/todos.controller'),
          {
            TodosController: {
              create: { type: t['./todos/entities/todo.entity'].Todo },
              findAll: { type: [Object] },
              findOne: { type: Object },
              update: { type: Object },
              remove: { type: Object },
            },
          },
        ],
        [
          import('./users/users.controller'),
          {
            UsersController: {
              create: { type: String },
              findAll: { type: String },
              findOne: { type: String },
              update: { type: String },
              remove: { type: String },
            },
          },
        ],
      ],
    },
  }
}
