import { EntitySchema } from "typeorm";

export const SimulationEntity = new EntitySchema({
  name: "Simulation",
  tableName: "simulations",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    notice_id: {
      type: "int",
      nullable: true,
    },
    area_id: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    notice: {
      type: "many-to-one",
      target: "Notice",
      joinColumn: { name: "notice_id" },
      nullable: true,
    },
    area: {
      type: "many-to-one",
      target: "Area",
      joinColumn: { name: "area_id" },
      nullable: true,
    },
    questions: {
      type: "one-to-many",
      target: "Question",
      inverseSide: "simulation",
    },
    simulation_attempts: {
      type: "one-to-many",
      target: "SimulationAttempt",
      inverseSide: "simulation",
    },
  },
});