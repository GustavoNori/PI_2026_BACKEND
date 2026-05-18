import { EntitySchema } from "typeorm";

export const Area = new EntitySchema({
    name: "Area",
    tableName: "areas",

    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            type: String,
        },
    },

    relations: {
        notices: {
            type: "one-to-many",
            target: "Notice",
            inverseSide: "area",
        },
    },
});