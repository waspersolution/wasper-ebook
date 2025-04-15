
// Define a non-recursive Json type to avoid "excessively deep" TypeScript errors
export type JsonPrimitive = string | number | boolean | null;
export interface JsonObject {
  [key: string]: JsonValue;
}
export interface JsonArray extends Array<JsonValue> {}
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// This is the safe Json type we'll use throughout the app
export type Json = JsonValue;
