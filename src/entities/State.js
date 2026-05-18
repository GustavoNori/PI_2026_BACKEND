const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "State",
    tableName: "states",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        code: {
            type: "varchar",
        },
    },
    relations: {
        notices: {
            type: "one-to-many",
            target: "Notice",
            inverseSide: "state",
        },
    },
});