import React from 'react'
import axios from 'axios'
import Form from './Form'
import TodoList from './TodoList'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleteds: true,
  }
  onToDoNameInputChange = evt => {
    const { value } = evt.target
    this.setState({...this.state, todoNameInput: value})
  }
  resetForm = () => this.setState({...this.state, todoNameInput: ''})

  setAxiosResponseError = err => this.setState({...this.state, error: err.response.data.message})

  postNewToDo = () => {
    axios.post(URL, { name: this.state.todoNameInput })
    .then(res => {
      this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data)})
      this.resetForm()
    }).catch(this.setAxiosResponseError)
  }

  onToDoFormSubmit = evt => {
    evt.preventDefault()
    this.postNewToDo()
  }
  fetchAllTodos = () => {
     axios.get(URL)
     .then(res => {
      this.setState({ ...this.state, todos: res.data.data})
      
     })
     .catch(this.setAxiosResponseError)
  }

  toggleCompleted = id => () =>{
    axios.patch(`${URL}/${id}`)
    .then(res => {
      this.setState({...this.setState, todos: this.state.todos.map(td => {
        if(td.id !== id) return td
        return res.data.data
      })
    })

    }) .catch(this.setAxiosResponseError)
  }

  toggleDisplayCompleteds = () => {
    this.setState({...this.state, displayCompleteds: !this.state.displayCompleteds })
  }



  componentDidMount(){
    //fetch all todos from server
    this.fetchAllTodos()
  }
  render() {
    return (
      <div>
        <TodoList 
        todos = {this.state.todos}
        displayCompleteds={this.state.displayCompleteds}
        toggleCompleted= {this.toggleCompleted}
        />
        <Form 
        onToDoFormSubmit={this.onToDoFormSubmit}
        todoNameInput={this.state.todoNameInput}
        onToDoNameInputChange={this.onToDoNameInputChange}
        toggleDisplayCompleteds={this.toggleDisplayCompleteds}
        displayCompleteds={this.state.displayCompleteds}
        />
      </div>
    )
  }
}
