import React, { useState } from "react";
import { Input, Text } from "@mantine/core";
import { Button } from "@mantine/core";
import styles from "./AddTodo.module.css";

interface AppTodo {
  onCreate: () => void;
}

const AddTodo: React.FC<AppTodo> = ({ onCreate }) => {
  const [currentTodo, setCurrentTodo] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | Error>("");

  const handleTodoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    if (error) setError(false);
    setCurrentTodo(value);
  };

  const onSubmit = async () => {
    if (!currentTodo) {
      setError(true);
      return;
    }
    try {
      const resp = await fetch("/create-todo", {
        method: "POST",
        body: JSON.stringify(currentTodo),
      });
      const respData = await resp.json();
      if (resp.status === 200) {
        onCreate();
        setCurrentTodo("");
      } else {
        setApiError(respData.msg);
      }
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error);
      }
    }
  };

  return (
    <>
      <div className={styles.addTodoWrapper}>
        <Input
          placeholder="Search Todo List"
          value={currentTodo}
          variant="filled"
          size="sm"
          onChange={handleTodoChange}
          className={styles.addTodoInput}
          error={error}
        />
        <Button variant="filled" color="gray" onClick={onSubmit}>
          Submit
        </Button>
      </div>
      {apiError && <Text c="red">{`${apiError}`}</Text>}
    </>
  );
};

export default AddTodo;
