import { EntitySchema } from "typeorm";

export const Question = new EntitySchema({
    name: "Question",
    tableName: "questions",

    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        statement: {
            type: "text",
        },
        option_a: {
            type: String,
        },
        option_b: {
            type: String,
        },
        option_c: {
            type: String,
        },
        option_d: {
            type: String,
        },
        option_e: {
            type: String,
        },
        correct_option: {
            type: String,
        },
    },

    relations: {
        simulation: {
            type: "many-to-one",
            target: "Simulation",
            joinColumn: {
                name: "simulation_id",
            },
            nullable: false,
        },
    },
});