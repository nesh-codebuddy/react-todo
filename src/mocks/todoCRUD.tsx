import { http, HttpResponse } from "msw";
import { TodoItemType } from "../types/types";

export const todoCRUD = [
  http.get("/get-todo", () => {
    let store: any = localStorage.getItem("todoData");
    store = store ? JSON.parse(store) : [];
    console.log("store", store);
    return HttpResponse.json(store, { status: 200 });
  }),
  http.post("/create-todo", async ({ request }) => {
    const newTodoTitle = await request.json();
    console.log("newTodo", newTodoTitle);

    const newTodo = {
      id: new Date().getTime(),
      title: newTodoTitle,
    };

    let store: any = localStorage.getItem("todoData");
    store = store ? JSON.parse(store) : [];
    store = [...store, newTodo];
    localStorage.setItem("todoData", JSON.stringify(store));
    return HttpResponse.json(newTodo, { status: 200 });
  }),
  http.delete("/delete-todo/:id", ({ params }) => {
    let store: any = localStorage.getItem("todoData");
    store = store ? JSON.parse(store) : [];
    if (store.length === 0) {
      return HttpResponse.text("No Record to delete", { status: 500 });
    }
    if (!params.id) {
      return HttpResponse.text("No Id found to delete", { status: 500 });
    }
    const todoItemIndex = store.findIndex(
      (todo: TodoItemType) => todo.id === +params.id
    );
    const currentTodo = store[todoItemIndex];
    store = [
      ...store.slice(0, todoItemIndex),
      ...store.slice(todoItemIndex + 1),
    ];
    localStorage.setItem("todoData", JSON.stringify(store));
    return HttpResponse.json(currentTodo, { status: 200 });
  }),
];
