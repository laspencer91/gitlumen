/**
 * Common type definitions for JSON-like data structures
 * These types provide better type safety than Record<string, any>
 */

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Configuration object type for plugin and provider configurations
 * More specific than JsonValue, excludes arrays for config objects
 */
export type ConfigObject = { [key: string]: JsonPrimitive | JsonObject };

/**
 * Metadata object type for storing additional information
 * Allows nested objects and arrays for flexible metadata storage
 */
export type MetadataObject = JsonObject;

/**
 * Headers type for HTTP requests/responses
 * Typically string values but can include arrays for multiple values
 */
export type HttpHeaders = { [key: string]: string | string[] | undefined };

/**
 * Filter configuration type for event subscriptions
 * Allows various filter criteria types
 */
export type FilterConfig = { [key: string]: JsonValue };