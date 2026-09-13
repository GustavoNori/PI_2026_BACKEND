import { EntitySchema } from "typeorm";

export const Checkout = new EntitySchema({
    name: "Checkout",    
    tableName: "checkouts",    
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        plan_id: {
            type: "int",
        },
        user_id: {
            type: "int",
        },
        pago: {
            type: "boolean",
            default: false,
        },
        preference_id: {
            type: "varchar",
            nullable: true,
        },
        payment_id: {
            type: "varchar",
            nullable: true,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "user_id" },
            onDelete: "CASCADE",
        },
        plan: {
            type: "many-to-one",
            target: "Plan",
            joinColumn: { name: "plan_id" },
        }
    },
});