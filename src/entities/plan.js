import { EntitySchema } from "typeorm";

export const Plan = new EntitySchema({
    name: "Plan",    
    tableName: "plan",    
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
        description: {
            type: "varchar",
            nullable: true,
        },
        value: {
            type: "decimal",
            precision: 10,
            scale: 2,
        },
        activate: {
            type: "Boolean",
            default: true,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
        },
    },
    relations: {},
});