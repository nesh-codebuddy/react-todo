import React from "react";
import { Text } from "@mantine/core";
import styles from "./ListTodo.module.css";
import { Button } from "@mantine/core";
import { TodoItemType } from "../../types/types";

interface ListTodo {
  todo: TodoItemType;
  deleteTodo: React.MouseEventHandler<HTMLButtonElement>;
}

const ListTodo = (props: ListTodo) => {
  const { todo, deleteTodo } = props;
  return (
    <div className={styles.listTodoWrapper} key={todo.id}>
      <Text size="lg" className={styles.todoText}>{todo.title}</Text>
      <Button variant="filled" color="gray" onClick={deleteTodo}>
        Delete
      </Button>
    </div>
  );
};

export default ListTodo;
