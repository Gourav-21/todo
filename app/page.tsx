'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null)
  const [todos, setTodos] = useState<Todo[]>([]);

  function handleAddTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setTodos([...todos, { task: inputValue, completed: false, id: Math.floor(Math.random() * 100000000) }]);
      setInputValue("");
    }
  }

  function toggleTask(index: number) {
    const updatedTodos = todos.map((todo) =>
      todo.id === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  }

  const handleDeleteTodo = (index: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== index); // Remove the selected todo
    setTodos(updatedTodos); // Update the state with the remaining todos
  };

  const startEditing = (id: number) => {
    setEditingId(id)
  }

  const finishEditing = (id: number, newTitle: string) => {
    setTodos(todos.map(todo => 
      todo.id == id ? { ...todo, task: newTitle.trim() } : todo
    ))
    setEditingId(null)
  }

  return (
    <div className="flex mt-20 items-center justify-center">
      <div>
        <CardHeader>
          <CardTitle className="text-3xl text-center">Todo App</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <form onSubmit={handleAddTodo} className="flex gap-2 ">
            <Input
              type="text"
              placeholder="Add your task"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button>Submit</Button>
          </form >
          <div>
            {todos.length === 0 && <p className="text-center mt-20">No tasks added yet</p>}
            <ScrollArea className="h-[400px] w-[350px]">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  toggleTask={toggleTask}
                  startEditing={startEditing}
                  finishEditing={finishEditing}
                  handleDeleteTodo={handleDeleteTodo}
                  editingId={editingId}
                />
              ))}
            </ScrollArea>
          </div>
        </CardContent>
      </div>
    </div>
  );
}

export default App;

function TodoItem({
  todo,
  toggleTask,
  startEditing,
  finishEditing,
  handleDeleteTodo,
  editingId
}: {
  todo: Todo;
  toggleTask: (index: number) => void;
  startEditing: (index: number) => void;
  finishEditing: (index: number, newTitle: string) => void;
  handleDeleteTodo: (index: number) => void;
  editingId: number | null
}) {
  return (
    <Card className={`p-3 my-2 flex items-center justify-between ${todo.completed ? 'border-2 border-green-500' : ''}`}>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => toggleTask(todo.id)}
          className={`h-5 w-5 ${todo.completed ? 'text-white' : ''}`}
        />
        {editingId === todo.id ? (
          <Input
            type="text"
            defaultValue={todo.task}
            onBlur={(e) => finishEditing(todo.id, e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && finishEditing(todo.id, e.currentTarget.value)}
            className="flex-grow"
            autoFocus
          />
        ) : (
          <Label onClick={() => startEditing(todo.id)} htmlFor="text">{todo.task}</Label>
        )}
      </div>
      <div className="cursor-pointer" onClick={() => handleDeleteTodo(todo.id)}>
        ❌
      </div>
    </Card>
  );
}