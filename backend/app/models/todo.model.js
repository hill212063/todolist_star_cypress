module.exports = (sequelize, Sequelize) => {
    const Todo = sequelize.define("todo", {
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        finished: {
            type: Sequelize.BOOLEAN
        },
        favor: {
            type: Sequelize.BOOLEAN,
            defaultValue:false
        }
    });

    return Todo;
};
