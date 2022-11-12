/* eslint-disable max-len */
import { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { getTodos } from './api';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoId, setTodoId] = useState(0);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  async function getTodosFromServer() {
    const allTodos = await getTodos();

    setTodosFromServer(allTodos);
    setTodos(allTodos);
    setLoading(false);
  }

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const filteredTodos = () => {
    const toFilter = todos.filter(todo => {
      const filterByQuery = todo.title.toLowerCase()
        .includes(query.toLowerCase());

      switch (filter) {
        case 'active':
          return !todo.completed && filterByQuery;
        case 'completed':
          return todo.completed && filterByQuery;
        default:
          return filterByQuery;
      }
    });

    return toFilter;
  };

  const resetForm = () => {
    setQuery('');
    setTodos(todosFromServer);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                filter={filter}
                setQuery={setQuery}
                query={query}
                resetForm={resetForm}
                setFilter={setFilter}

              />
            </div>

            <div className="block">
              {loading
                ? <Loader />
                : (
                  <TodoList
                    todos={filteredTodos()}
                    selectedTodo={todoId}
                    setSelectedTodo={setSelectedTodo}
                    setTodoId={(todosId) => {
                      setTodoId(todosId);
                    }}
                  />
                )}
            </div>

            {todoId !== 0 && selectedTodo && (
              <TodoModal
                selectedTodo={selectedTodo}
                setTodoId={(todosId) => {
                  setTodoId(todosId);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
