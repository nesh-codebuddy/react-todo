import React, { useState, useEffect } from "react";
import { TodoItemType } from "./types/types";
import { Input, Text, Center, Loader } from "@mantine/core";
import "./App.css";
import AddTodo from "./components/AddTodo/AddTodo";
import ListTodo from "./components/ListTodo/ListTodo";

const App = () => {
  const [todoList, setTodoList] = useState<Array<TodoItemType>>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState<Array<TodoItemType>>([]);
  const [apiError, setApiError] = useState<string | Error>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTodoList = async () => {
    try {
      const list = await fetch("/get-todo", {
        method: "GET",
      });
      const todoData = await list.json();
      if (list.status === 200) {
        console.log("list", todoData);
        setTodoList(todoData);
      } else {
        setApiError(todoData.msg);
      }
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setTimeout(getTodoList, 1000);
    // getTodoList();
  }, []);

  useEffect(() => {
    if (searchValue) {
      handleSearch({ target: { value: searchValue } });
    }
  }, [todoList]);

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }
  ) => {
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
      const respData = await resp.json();
      if (resp.status === 200) {
        getTodoList();
      } else {
        setApiError(respData.msg);
      }
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error);
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <Center className="center">
        <Loader />
      </Center>
    );
  }

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
      {apiError && <Text c="red">{`${apiError}`}</Text>}
      {searchResult.length > 0 &&
        searchValue &&
        searchResult.map((todo) => (
          <ListTodo
            todo={todo}
            deleteTodo={() => handleDelete(todo.id)}
            key={todo.id}
          />
        ))}
      {searchValue && searchResult.length === 0 && (
        <Text className="text">No Search Result Found</Text>
      )}
      {todoList.length > 0 &&
        !searchValue &&
        todoList.map((todo) => (
          <ListTodo
            todo={todo}
            deleteTodo={() => handleDelete(todo.id)}
            key={todo.id}
          />
        ))}
      {todoList.length === 0 && !searchValue && (
        <Text className="text">No Results Found</Text>
      )}
    </div>
  );
};

export default App;
