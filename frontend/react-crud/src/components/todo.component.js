import React, {Component} from "react";
import TodoListDataService from "../services/todo.service";

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.getTodo = this.getTodo.bind(this);
        this.updateFinished = this.updateFinished.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.deleteTodo = this.deleteTodo.bind(this);
        this.shiningStar = require('../images/shining-star.png')
        this.noneShiningStar = require('../images/none-shining-star.png')

        this.state = {
            currentTodo: {
                id: null,
                title: "",
                description: "",
                finished: false,
                favor: false
            },
            message: ""
        };
    }

    componentDidMount() {
        this.getTodo(this.props.match.params.id);
    }

    onChangeTitle(e) {
        const title = e.target.value;

        this.setState(function(prevState) {
            return {
                currentTodo: {
                    ...prevState.currentTodo,
                    title: title
                }
            };
        });
    }

    onChangeDescription(e){
        const description = e.target.value;

        this.setState(prevState => ({
            currentTodo: {
                ...prevState.currentTodo,
                description: description
            }
        }));
    }

    getTodo(id) {
        TodoListDataService.get(id)
        .then(response => {
            this.setState({
                currentTodo: response.data
            });
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    updateFinished(status) {
        var data = {
            id: this.state.currentTodo.id,
            title: this.state.currentTodo.title,
            description: this.state.currentTodo.description,
            finished: status
        };

        TodoListDataService.update(this.state.currentTodo.id, data)
        .then(response => {
            this.setState(prevState => ({
                currentTodo: {
                    ...prevState.currentTodo,
                    finished: status
                }
            }));
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    updateTodo() {
        TodoListDataService.update(
            this.state.currentTodo.id,
            this.state.currentTodo
        )
            .then(response => {
                console.log(response.data);
                this.setState({
                    message: "The todo was updated successfully!"
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    deleteTodo() {
        TodoListDataService.delete(this.state.currentTodo.id)
        .then(response => {
            console.log(response.data);
            this.props.history.push('/todo')
        })
        .catch(e => {
            console.log(e);
        });
    }

    setFavorite(Todo,status){
        var data = {
            id: Todo.id,
            title: Todo.title,
            description: Todo.description,
            finished: Todo.finished,
            favor: status
        };

        TodoListDataService.update(Todo.id, data)
        .then(response => {
                this.setState(prevState => ({
                    currentTodo: {
                        ...prevState.currentTodo,
                        favor: status
                    }
                }));
            console.log(response.data);
        })
        .catch(e => {
            console.log(e);
        });
    }

    render() {
        const { currentTodo } = this.state;

        return (
            <div>
                {currentTodo ? (
                    <div className ="edit-form">
                    <h4>Todo</h4>
                    <form>
                        <div className="form-group">
                            <label htmlFor = "title">Title</label>
                            <input
                              type = "text"
                              className="form-control"
                              id="title"
                              value={currentTodo.title}
                              onChange={this.onChangeTitle}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <input
                              type = "text"
                              className="form-control"
                              id="description"
                              value={currentTodo.description}
                              onChange={this.onChangeDescription}
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <strong>Status:</strong>
                            </label>
                            {currentTodo.finished ? "finished" : "Pending"}
                        </div>
                        <div className="form-group">
                            <label>
                                <strong>Favorite:</strong>
                            </label>
                            {<img src={(currentTodo.favor === true ? this.shiningStar:this.noneShiningStar)} alt="Star" width='15px' height='15px'/>}
                        </div>
                    </form>

                    {currentTodo.finished ? (
                        <button
                          className="badge badge-primary mr-2"
                          onClick={() => this.updateFinished(false)}
                        >
                          Unfinished
                        </button>
                    ) : (
                        <button
                          className="badge badge-primary mr-2"
                          onClick={() => this.updateFinished(true)}
                        >
                          Finished
                        </button>
                    )}

                    <button
                      className="badge badge-danger mr-2"
                      onClick={this.deleteTodo}
                    >
                      Delete
                    </button>
                    

                    <button
                      type="submit"
                      className="badge badge-success mr-2"
                      onClick={this.updateTodo}
                      
                    >
                      Update
                    </button>
          
                    {currentTodo.favor ? (
                        <button
                            className="badge badge-outline-warning"
                            id='favoritebutton'
                            onClick={() => this.setFavorite(currentTodo,false)}
                        >
                            Unfavorite
                        </button>
                    ) : (
                        <button
                            className="badge badge-warning"
                            id='favoritebutton'
                            onClick={() => this.setFavorite(currentTodo,true)}
                        >
                            Favorite
                        </button>
                    )}
                    <p>{this.state.message}</p>
            </div>
        ) : (
            <div>
                <br />
                <p>Please click on a Todo...</p>
            </div>
        )}
    </div>
        );
    }
}