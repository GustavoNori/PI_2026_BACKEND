const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "SimulationAttempt",
    tableName: "simulation_attempts",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        score: {
            type: "decimal",
            nullable: true,
        },
        started_at: {
            type: "timestamp",
            nullable: true,
        },
        finished_at: {
            type: "timestamp",
            nullable: true,
        },
        user_id: {
            type: "int",
        },
        simulation_id: {
            type: "int",
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "user_id" },
        },
        simulation: {
            type: "many-to-one",
            target: "Simulation",
            joinColumn: { name: "simulation_id" },
        },
    },
});