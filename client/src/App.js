import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import shortid from 'shortid';

function App() {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [edit, setEdit] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('addTask', (event) => {
      addTask(event);
    });
    socket.on('removeTask', (id) => removeTask(id, false));
    socket.on('updateData', (event) => {
      updateTasks(event);
    });
    socket.on('editTask', (task) => {
      setTasks((tasks) => tasks.map((el) => (el.id === task.id ? task : el)));
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  function removeTask(id, emit = true) {
    setTasks((tasks) => tasks.filter((task) => task.id !== id));
    if (emit) {
      socket.emit('removeTask', id);
    }
  }

  function submitForm(e) {
    e.preventDefault();
    const newTask = { id: shortid.generate(), name: taskName };
    addTask(newTask);
    socket.emit('addTask', newTask);
    setTaskName('');
  }

  function addTask(task) {
    setTasks((tasks) => [...tasks, task]);
  }

  function updateTasks(newTasks) {
    setTasks(newTasks);
  }

  function startEdit(task) {
    setEdit(task.id);
    setText(task.name);
  }

  function saveEdit() {
    const task = { id: edit, name: text };
    setTasks((tasks) => tasks.map((el) => (el.id === edit ? task : el)));
    if (socket) {
      socket.emit('editTask', task);
    }
    setEdit(null);
    setText('');
  }
  return (
    <div className='App'>
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className='tasks-section' id='tasks-section'>
        <h2>Tasks</h2>

        <ul className='tasks-section__list' id='tasks-list'>
          {tasks.map((task) => {
            return (
              <li className='task' key={task.id}>
                {edit === task.id ? (
                  <>
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <button className='btn' onClick={saveEdit}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span>{task.name}</span>
                    <button
                      className='btn'
                      onClick={() => startEdit(task)}
                    >
                      Edit
                    </button>
                  </>
                )}
                <button
                  className='btn btn--red'
                  onClick={() => removeTask(task.id)}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>

        <form id='add-task-form' onSubmit={submitForm}>
          <input
            className='text-input'
            autoComplete='off'
            type='text'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder='Type your description'
            id='task-name'
          />
          <button className='btn' type='submit'>
            Add
          </button>
        </form>
      </section>
    </div>
  );
}

export default App;
