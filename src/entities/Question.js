import { EntitySchema } from "typeorm";

export const QuestionEntity = new EntitySchema({
  name: "Question",
  tableName: "questions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    statement: {
      type: "text",
    },
    option_a: {
      type: "varchar",
    },
    option_b: {
      type: "varchar",
    },
    option_c: {
      type: "varchar",
    },
    option_d: {
      type: "varchar",
    },
    option_e: {
      type: "varchar",
      nullable: true,
    },
    correct_option: {
      type: "varchar",
    },
    simulation_id: {
      type: "int",
    },
  },
  relations: {
    simulation: {
      type: "many-to-one",
      target: "Simulation",
      joinColumn: { name: "simulation_id" },
    },
  },
});