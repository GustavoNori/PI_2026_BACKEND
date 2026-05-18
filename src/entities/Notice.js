import { EntitySchema } from "typeorm";

export const Notice = new EntitySchema({
    name: "Notice",
    tableName: "notices",

    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        title: {
            type: String,
        },
        description: {
            type: "text",
        },
        publication_date: {
            type: "date",
        },
        link: {
            type: String,
        },
        created_at: {
            type: "timestamp",
        },
    },

    relations: {
        area: {
            type: "many-to-one",
            target: "Area",
            joinColumn: {
                name: "area_id",
            },
            nullable: false,
        },

        state: {
            type: "many-to-one",
            target: "State",
            joinColumn: {
                name: "state_id",
            },
            nullable: false,
        },

        email_logs: {
            type: "one-to-many",
            target: "EmailLog",
            inverseSide: "notice",
        },
    },
});