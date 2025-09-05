import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable().unique();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("schedules", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();
    table.integer("day_of_week").notNullable(); // 0 (Sunday) to 6 (Saturday)
    table.integer("slot_number").checkBetween([0,1]).notNullable(); 
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
  });

  await knex.schema.createTable("edited_schedules", (table) => {
    table.increments("id").primary();

    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .notNullable();
    table
      .integer("schedule_id")
      .references("id")
      .inTable("schedules")
      .onDelete("CASCADE")
      .notNullable();

    table.date("occurrence_date").notNullable();
    table.integer("day_of_week").notNullable(); // 0 (Sunday) to 6 (Saturday)
    table.integer("slot_number").checkBetween([0,1]).notNullable(); 
    table.time("start_time").notNullable();
    table.time("end_time").notNullable();
    table.unique(["schedule_id", "occurrence_date"]);
  });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("edited_schedules");
    await knex.schema.dropTableIfExists("schedules");
    await knex.schema.dropTableIfExists("users");
}
