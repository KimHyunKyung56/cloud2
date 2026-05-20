import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const API_URL = 'http://localhost:8080/api/todos'

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return
    
    const newTodo = { text: inputValue, completed: false }
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      })
      const savedTodo = await response.json()
      setTodos([...todos, savedTodo])
      setInputValue('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id) => {
    const todoToToggle = todos.find(t => t.id === id)
    if (!todoToToggle) return

    const updatedTodo = { ...todoToToggle, completed: !todoToToggle.completed }
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo)
      })
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <>
      <section id="center">
        이순신~~~~~<br/>
        <h1>Todo List</h1>
        <form onSubmit={addTodo} className="todo-input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="todo-input"
          />
          <button type="submit" className="add-button">Add</button>
        </form>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <span onClick={() => toggleTodo(todo.id)} className="todo-text">
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)} className="delete-button">
                Delete
              </button>
            </li>
          ))}
        </ul>
        {todos.length === 0 && <p className="empty-message">No tasks yet. Add one!</p>}
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>Project Info</h2>
          <p>This is a simple Todo List example built with React and Vite.</p>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
