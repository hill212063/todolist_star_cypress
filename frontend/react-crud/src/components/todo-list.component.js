import React,{Component} from "react";
import TodoListDataService from "../services/todo.service";
import {Link} from "react-router-dom";

export default class TodoList extends Component{
    constructor(props){
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.retrieveTodo = this.retrieveTodo.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveTodo = this.setActiveTodo.bind(this);
        this.removeAllTodo = this.removeAllTodo.bind(this);
        this.searchTitle = this.searchTitle.bind(this);
        this.shiningStar = require('../images/shining-star.png')
        this.noneShiningStar = require('../images/none-shining-star.png')
        this.state ={
            todo:[],
            currentTodo: null,
            currentIndex: -1,
            searchTitle:""
        };
    }

    componentDidMount(){
        this.retrieveTodo();
    }

    onChangeSearchTitle(e){
        const searchTitle = e.target.value;
        this.setState({
            searchTitle : searchTitle
        });
    }

    retrieveTodo(){
        TodoListDataService.getAll()
        .then(response =>{
            this.setState({
                todo:response.data
            });
            console.log(response.data);
        })
        .catch(e =>{
            console.log(e);
        })
    }

    removeAllTodo(){
        TodoListDataService.deleteAll()
            .then(response => {
                console.log(response.data);
                this.refreshList();
            })
            .catch(e => {
                console.log(e);
            });
    }

    refreshList(){
        this.retrieveTodo();
        this.setState({
            currentTodo:null,
            currentIndex:-1
        });
    }

    setActiveTodo(Todo,index){
        this.setState({
            currentTodo: Todo,
            currentIndex:index
        });
    }

    searchTitle(){
        TodoListDataService.findByTitle(this.state.searchTitle)
        .then(response =>{
            this.setState({
                todo:response.data
            });
            console.log(response.data);
        })
        .catch(e =>{
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
            console.log(response.data);
            this.refreshList();
        })
        .catch(e => {
            console.log(e);
        });
    }

    render(){
        const {searchTitle,todo,currentIndex,currentTodo} = this.state;
        return(
            <div className="list row">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                        type='text'
                        className="form-control"
                        placeholder="Search by title"
                        value={searchTitle}
                        onChange={this.onChangeSearchTitle}
                        />
                        <div className="input-group-append">
                            <button
                             className="btn btn-outline-secondary"
                             type = "button"
                             onClick={this.searchTitle}
                            >
                            Search
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <h4>Todo List</h4>
                    <ul className="list-group">
                        {todo &&
                            todo.map((Todo,index)=>(
                               <li
                                className={"list-group-item "+
                                (index === currentIndex ? "active":"")
                                }
                                onClick={()=> this.setActiveTodo(Todo,index)}
                                key={index}
                                >
                                   {<img src={(Todo.favor === true ? this.shiningStar:this.noneShiningStar)} alt="Star" width='15px' height='15px'/>}{Todo.title}
                               </li> 
                            ))}
                    </ul>
                    <button 
                     className="m-3 btn btn-sm btn-danger"
                     onClick={this.removeAllTodo}
                    >
                        Remove All
                    </button>
                </div>
                <div className="col-md-6">
                    {currentTodo ?(
                        <div>
                            <h4>Todo</h4>
                            <div>
                                <label>
                                    <strong>Title:</strong>

                                </label>{" "}
                                {currentTodo.title}
                            </div>
                            <div>
                                <label>
                                    <strong>Description:</strong>
                                </label>{" "}
                                {currentTodo.description}
                            </div>
                            <div>
                                <label>
                                    <strong>Status:</strong>
                                </label>{" "}
                                {currentTodo.finished ? "Finished": "Pending"}
                            </div>
                            <Link
                            to={"/todo/"+currentTodo.id}
                            className="badge badge-primary mr-2"
                            >
                            Edit
                            </Link>
                            <button                    
                                type="button"
                                className={(currentTodo.favor === true ? "badge badge-outline-warning":"badge badge-warning")}
                                id='favoritebutton'
                                onClick={()=> this.setFavorite(currentTodo,(currentTodo.favor ? false:true))}
                            >
                                {(currentTodo.favor ? "unfavorite":"favorite")}
                            </button>
                        </div>

                    ) :(
                        <div>
                            <br/>
                            <p>Please click on a Todo...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
