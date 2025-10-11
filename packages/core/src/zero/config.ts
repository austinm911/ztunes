import { getTableColumns, type Table } from "drizzle-orm";
import { drizzleZeroConfig } from "drizzle-zero";
import * as drizzleSchema from "../db/schema";

/**
 * Extract column names from a Drizzle table type
 * Uses the same approach as drizzle-zero internally
 */
type ColumnNames<TypeTable extends Table> = keyof TypeTable["_"]["columns"];

/**
 * Helper function to create table configuration for drizzle-zero
 * Sets all columns to true except those specified in the exclude array
 *
 * @template TTable - The Drizzle table type
 * @param table - The Drizzle table instance
 * @param options - Configuration options
 * @param options.exclude - Array of column names to exclude (set to false) - type-safe, only allows actual column names
 * @returns Configuration object compatible with drizzle-zero's ColumnsConfig type
 *
 * @example
 * ```ts
 * // Include all columns except 'email'
 * users: createTableConfig(drizzleSchema.users, { exclude: ['email'] })
 *
 * // Include all columns except 'password' and 'secret'
 * accounts: createTableConfig(drizzleSchema.accounts, { exclude: ['password', 'secret'] })
 *
 * // Include all columns
 * members: createTableConfig(drizzleSchema.members)
 * ```
 */
const createTableConfig = <TypeTable extends Table>(
	table: TypeTable,
	options: { exclude?: ColumnNames<TypeTable>[] } = {},
) => {
	const { exclude = [] } = options;

	if (!table) {
		throw new Error("Table is undefined or null");
	}

	// Use Drizzle's built-in utility to get table columns
	// This is the same approach used by drizzle-zero internally
	const tableColumns = getTableColumns(table);

	const config: Record<string, boolean> = {};

	// Iterate over the column keys (property names on the table object)
	for (const columnKey of Object.keys(tableColumns)) {
		config[columnKey] = !exclude.includes(columnKey as ColumnNames<TypeTable>);
	}

	return config as any; // Type assertion to bypass strict typing
};

export default drizzleZeroConfig(drizzleSchema, {
	debug: true,
	casing: "snake_case",
	tables: {
		artist: createTableConfig(drizzleSchema.artist),
		album: createTableConfig(drizzleSchema.album),
		cartItem: createTableConfig(drizzleSchema.cartItem),
		user: createTableConfig(drizzleSchema.user),
		session: createTableConfig(drizzleSchema.session),
		account: createTableConfig(drizzleSchema.account),
		verification: createTableConfig(drizzleSchema.verification),
		jwks: createTableConfig(drizzleSchema.jwks),
	},
});
