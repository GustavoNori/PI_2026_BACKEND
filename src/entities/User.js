import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password_hash: {
      type: "varchar",
    },
    role: {
  type: "enum",
  enum: ["user", "admin"],
  default: "user",
},
    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    subscriptions: {
      type: "one-to-many",
      target: "Subscription",
      inverseSide: "user",
    },
    email_logs: {
      type: "one-to-many",
      target: "EmailLog",
      inverseSide: "user",
    },
    favorites: {
  type: "one-to-many",
  target: "Favorite",
  inverseSide: "user",
},
  },
});
