import { EntitySchema } from "typeorm";

export const EmailLog = new EntitySchema({
    name: "EmailLog",
    tableName: "email_logs",

    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        sent_at: {
            type: "timestamp",
        },
    },

    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: {
                name: "user_id",
            },
            nullable: false,
        },

        notice: {
            type: "many-to-one",
            target: "Notice",
            joinColumn: {
                name: "notice_id",
            },
            nullable: false,
        },
    },
});