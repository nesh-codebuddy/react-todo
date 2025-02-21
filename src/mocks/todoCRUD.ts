import { http, HttpResponse } from "msw";
import { TodoItemType } from "../types/types";

export const todoCRUD = [
  http.get("/get-todo", () => {
    let store: string = localStorage.getItem("todoData") || "{}";
    let todoData = store ? JSON.parse(store) : [];
    return HttpResponse.json(todoData, { status: 200 });
  }),
  http.post("/create-todo", async ({ request }) => {
    const newTodoTitle = await request.json();
    console.log("newTodo", newTodoTitle);

    const newTodo = {
      id: new Date().getTime(),
      title: newTodoTitle,
    };

    let store: string = localStorage.getItem("todoData") || "";
    let todoData = store ? JSON.parse(store) : [];
    todoData = [...todoData, newTodo];
    localStorage.setItem("todoData", JSON.stringify(todoData));
    return HttpResponse.json(newTodo, { status: 200 });
  }),
  http.delete("/delete-todo/:id", ({ params }) => {
    let store: string = localStorage.getItem("todoData") || "";
    let todoData = store ? JSON.parse(store) : [];
    if (todoData.length === 0) {
      return HttpResponse.json({ msg: "No Data Found" }, { status: 500 });
    }
    if (!params.id) {
      return HttpResponse.json({ msg: "No Id Found" }, { status: 500 });
    }
    let todoId = parseInt(params.id);
    if (typeof todoId === "number") {
      const todoItemIndex = todoData.findIndex(
        (todo: TodoItemType) => todo.id === todoId
      );
      const currentTodo = todoData[todoItemIndex];
      todoData = [
        ...todoData.slice(0, todoItemIndex),
        ...todoData.slice(todoItemIndex + 1),
      ];
      localStorage.setItem("todoData", JSON.stringify(todoData));
      return HttpResponse.json(currentTodo, { status: 200 });
    } else {
      return HttpResponse.json({ msg: "No Id Found" }, { status: 500 });
    }
  }),
];
