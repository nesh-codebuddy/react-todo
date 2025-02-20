import React, { useState, useEffect } from "react";
import { TodoItemType } from "./types/types";
import { Input, Text } from "@mantine/core";
import "./App.css";
import AddTodo from "./components/AddTodo/AddTodo";
import ListTodo from "./components/ListTodo/ListTodo";

const App = () => {
  const [todoList, setTodoList] = useState<Array<TodoItemType>>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<Array<TodoItemType>>([]);
  const [apiError, setApiError] = useState<string>("");

  const getTodoList = async () => {
    try {
      const list = await fetch("/get-todo", {
        method: "GET",
      });
      const todoData = await list.json();
      console.log("list", todoData);
      setTodoList(todoData);
    } catch (error: any) {
      console.log("error", error);
      setApiError(error.msg);
    }
  };

  useEffect(() => {
    setTimeout(getTodoList, 1000);
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setSearchValue(value);
    if (!value) return;
    const values = todoList.filter((todo: TodoItemType) =>
      todo.title.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResult(values);
  };

  const handleDelete = async (id: number) => {
    try {
      const resp = await fetch(`/delete-todo/${id}`, {
        method: "DELETE",
      });
      console.log("resp", resp);
      if (resp.status === 200) {
        getTodoList();
      }
    } catch (error: any) {
      console.log("error", error);
      setApiError(error.msg);
    }
  };
  return (
    <div className="wrapper">
      <Input
        placeholder="Search Todo List"
        value={searchValue}
        variant="filled"
        size="sm"
        onChange={handleSearch}
      />
      <AddTodo onCreate={getTodoList} />
      {apiError && <Text c="red">{apiError}</Text>}
      {searchResult.length > 0 &&
        searchValue &&
        searchResult.map((todo) => (
          <ListTodo todo={todo} deleteTodo={() => handleDelete(todo.id)} />
        ))}
      {todoList.length > 0 &&
        !searchValue &&
        todoList.map((todo) => (
          <ListTodo todo={todo} deleteTodo={() => handleDelete(todo.id)} />
        ))}
    </div>
  );
};

export default App;
