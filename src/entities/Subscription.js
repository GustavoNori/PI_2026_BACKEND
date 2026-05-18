const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Subscription",
    tableName: "subscriptions",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        plan: {
            type: "varchar",
        },
        status: {
            type: "varchar",
        },
        start_date: {
            type: "date",
            nullable: true,
        },
        end_date: {
            type: "date",
            nullable: true,
        },
        stripe_subscription_id: {
            type: "varchar",
            nullable: true,
        },
        user_id: {
            type: "int",
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "user_id" },
        },
    },
});