import React from "react";
import { Text } from "@mantine/core";
import styles from "./ListTodo.module.css";
import { Button } from "@mantine/core";
import { TodoItemType } from "../../types/types";

interface ListTodoInterface {
  todo: TodoItemType;
  deleteTodo: React.MouseEventHandler<HTMLButtonElement>;
}

const ListTodo: React.FC<ListTodoInterface> = ({ todo, deleteTodo }) => {
  return (
    <div className={styles.listTodoWrapper} key={todo.id}>
      <Text size="lg" className={styles.todoText}>
        {todo.title}
      </Text>
      <Button variant="filled" color="gray" onClick={deleteTodo}>
        Delete
      </Button>
    </div>
  );
};

export default ListTodo;
