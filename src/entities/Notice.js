import { EntitySchema } from "typeorm";

export const NoticeEntity = new EntitySchema({
  name: "Notice",
  tableName: "notices",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "text",
      nullable: true,
    },
    publication_date: {
      type: "date",
      nullable: true,
    },
    link: {
      type: "varchar",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    state_id: {
      type: "int",
      nullable: true,
    },
    area_id: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    state: {
      type: "many-to-one",
      target: "State",
      joinColumn: { name: "state_id" },
      nullable: true,
    },
    area: {
      type: "many-to-one",
      target: "Area",
      joinColumn: { name: "area_id" },
      nullable: true,
    },
    simulations: {
      type: "one-to-many",
      target: "Simulation",
      inverseSide: "notice",
    },
    email_logs: {
      type: "one-to-many",
      target: "EmailLog",
      inverseSide: "notice",
    },
  },
});