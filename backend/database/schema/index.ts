import type { ColumnType, Generated, JSONColumnType } from "kysely";
export type MemberStatus = "active" | "ignored" | "inactive" | "pending";
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type WorkspaceStatus = "active" | "inactive";
export type Permission = "admin" | "comment" | "modify" | "read" | "write";
export type Entity = "comment" | "issue" | "project" | "team" | "workspace";
export type JsonValue = JsonArray | JsonObject | JsonPrimitive;
export type JsonObject = {
  [K in string]?: JsonValue;
};

export type Json = JsonValue;
export type JsonArray = JsonValue[];
export type JsonPrimitive = boolean | number | string | null;