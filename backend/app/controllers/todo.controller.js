const db = require("../models");
const todo_list = db.todo_list;
const Op = db.Sequelize.Op;
const sequelize = require("sequelize");
exports.create = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const todo = {
        title: req.body.title,
        description: req.body.description,
        finished: req.body.finished ? req.body.finished :false
    };

    todo_list.create(todo)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Todo."
            });
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var data_tmp = [];
    let condition1 = { title: { [Op.like]: `%${title}%` },favor:{[Op.like]:'1'} }
    if(title==null){
    	condition1 = {favor:{[Op.like]:'1'} }
    }
    let condition2 = { title: { [Op.like]: `%${title}%` },favor:{[Op.like]:'0'} }
    if(title==null){
    	condition2 = {favor:{[Op.like]:'0'} }
    }
    todo_list.findAll({ where: condition1,order:sequelize.literal('updatedAt ASC') })
    .then(data=>{
    
	    data_tmp=data
	    todo_list.findAll({ where: condition2,order:sequelize.literal('updatedAt ASC') })
	    .then(data2 =>{
	    	res.send(data_tmp.concat(data2));
	    }).catch(err => {
		    res.status(500).send({
		        message:
		            err.message || "Some error occurred while retrieving Todo."
		    });
		});					
    
    }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Todo."
            });
        });
};


exports.findOne = (req, res) => {
    const id = req.params.id;

    todo_list.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some retrieving Todo with id=" + id
            });
        });
};


exports.update = (req, res) => {
    const id = req.params.id;
    let body = req.body;
    todo_list.update(body, {
        where: { id: id }
    })
        .then(num => {
            if(num == 1) {
                res.send({
                    message: "Todo was updated successfully."
                });
            }
            else {
                res.send({
                    message: `Cannot update Todo with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating todo with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    todo_list.destroy({
        where: { id: id }
    })
        .then(num => {
            if(num == 1) {
                res.send({
                    message: "Todo was deleted successfully!"
                });
            }
            else {
                res.send({
                    message: `Cannot delete Todo with id=${id}. Maybe todo was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete todo with id=" + id
            });
        });
};

exports.deleteAll = (req, res) => {
    todo_list.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} Todo were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while removing all todo."
            });
        });
};

exports.findAllFinished = (req, res) => {
    todo_list.findAll({ where: { finished: true } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : 
                    err.message || "Some error occured while retrieving todo."
            });
        });
};
