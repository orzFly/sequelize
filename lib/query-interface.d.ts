import { DataType } from './data-types'
import { Logging, Model, ModelAttributeColumnOptions, ModelAttributes, Transactionable } from './model'
import { Promise } from './promise'
import QueryTypes = require('./query-types')
import { Sequelize } from './sequelize'
import { Transaction } from './transaction'

/**
 * Interface for query options
 */
export interface QueryOptions extends Logging, Transactionable {
    /**
     * If true, sequelize will not try to format the results of the query, or build an instance of a model from
     * the result
     */
    raw?: boolean

    /**
     * The type of query you are executing. The query type affects how results are formatted before they are
     * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
     */
    type?: string

    /**
     * If true, transforms objects with `.` separated property names into nested objects using
     * [dottie.js](https://github.com/mickhansen/dottie.js). For example { 'user.username': 'john' } becomes
     * { user: { username: 'john' }}. When `nest` is true, the query type is assumed to be `'SELECT'`,
     * unless otherwise specified
     *
     * Defaults to false
     */
    nest?: boolean

    /**
     * Sets the query type to `SELECT` and return a single row
     */
    plain?: boolean

    /**
     * Either an object of named parameter replacements in the format `:param` or an array of unnamed
     * replacements to replace `?` in your SQL.
     */
    replacements?: object | string[]

    /**
     * Force the query to use the write pool, regardless of the query type.
     *
     * Defaults to false
     */
    useMaster?: boolean

    /**
     * A sequelize instance used to build the return instance
     */
    instance?: Model
}

export interface QueryOptionsWithModel {
    /**
     * A sequelize model used to build the returned model instances (used to be called callee)
     */
    model: typeof Model
}

export interface QueryOptionsWithType {
    /**
     * The type of query you are executing. The query type affects how results are formatted before they are
     * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
     */
    type: QueryTypes
}

/**
 * Most of the methods accept options and use only the logger property of the options. That's why the most used
 * interface type for options in a method is separated here as another interface.
 */
export interface QueryInterfaceOptions extends Logging, Transactionable {}

export interface QueryInterfaceCreateTableOptions extends QueryInterfaceOptions {
    engine?: string
    charset?: string
    /**
     * Used for compound unique keys.
     */
    uniqueKeys?: {
        [keyName: string]: {
            fields: string[]
        }
    }
}

export interface QueryInterfaceDropTableOptions extends QueryInterfaceOptions {
    cascade?: boolean
    force?: boolean
}

export interface QueryInterfaceDropAllTablesOptions extends QueryInterfaceOptions {
    skip?: string[]
}

export interface QueryInterfaceIndexOptions extends QueryInterfaceOptions {
    indicesType?: 'UNIQUE' | 'FULLTEXT' | 'SPATIAL'

    /** The name of the index. Default is __ */
    indexName?: string

    /** For FULLTEXT columns set your parser */
    parser?: string

    /** Set a type for the index, e.g. BTREE. See the documentation of the used dialect */
    indexType?: string
}

/**
 * The interface that Sequelize uses to talk to all databases.
 *
 * This interface is available through sequelize.QueryInterface. It should not be commonly used, but it's
 * referenced anyway, so it can be used.
 */
export class QueryInterface {
    /**
     * Returns the dialect-specific sql generator.
     *
     * We don't have a definition for the QueryGenerator, because I doubt it is commonly in use separately.
     */
    public QueryGenerator: any

    /**
     * Returns the current sequelize instance.
     */
    public sequelize: Sequelize

    constructor(sequelize: Sequelize)

    /**
     * Queries the schema (table list).
     *
     * @param schema The schema to query. Applies only to Postgres.
     */
    public createSchema(schema?: string, options?: QueryInterfaceOptions): Promise<void>

    /**
     * Drops the specified schema (table).
     *
     * @param schema The schema to query. Applies only to Postgres.
     */
    public dropSchema(schema?: string, options?: QueryInterfaceOptions): Promise<void>

    /**
     * Drops all tables.
     */
    public dropAllSchemas(options?: QueryInterfaceDropAllTablesOptions): Promise<void>

    /**
     * Queries all table names in the database.
     *
     * @param options
     */
    public showAllSchemas(options?: QueryOptions): Promise<object>

    /**
     * Return database version
     */
    public databaseVersion(options?: QueryInterfaceOptions): Promise<string>

    /**
     * Creates a table with specified attributes.
     *
     * @param tableName     Name of table to create
     * @param attributes    Hash of attributes, key is attribute name, value is data type
     * @param options       Table options.
     */
    public createTable(
        tableName: string | { schema?: string; tableName?: string },
        attributes: ModelAttributes,
        options?: QueryInterfaceCreateTableOptions
    ): Promise<void>

    /**
     * Drops the specified table.
     *
     * @param tableName Table name.
     * @param options   Query options, particularly "force".
     */
    public dropTable(tableName: string, options?: QueryInterfaceDropTableOptions): Promise<void>

    /**
     * Drops all tables.
     *
     * @param options
     */
    public dropAllTables(options?: QueryInterfaceDropTableOptions): Promise<void>

    /**
     * Drops all defined enums
     *
     * @param options
     */
    public dropAllEnums(options?: QueryOptions): Promise<void>

    /**
     * Renames a table
     */
    public renameTable(before: string, after: string, options?: QueryInterfaceOptions): Promise<void>

    /**
     * Returns all tables
     */
    public showAllTables(options?: QueryOptions): Promise<string[]>

    /**
     * Describe a table
     */
    public describeTable(
        tableName: string | { schema?: string; tableName?: string },
        options?: string | { schema?: string; schemaDelimeter?: string } & Logging
    ): Promise<object>

    /**
     * Adds a new column to a table
     */
    public addColumn(
        table: string | { schema?: string; tableName?: string },
        key: string,
        attribute: ModelAttributeColumnOptions | DataType,
        options?: QueryInterfaceOptions
    ): Promise<void>

    /**
     * Removes a column from a table
     */
    public removeColumn(
        table: string | { schema?: string; tableName?: string },
        attribute: string,
        options?: QueryInterfaceOptions
    ): Promise<void>

    /**
     * Changes a column
     */
    public changeColumn(
        tableName: string | { schema?: string; tableName?: string },
        attributeName: string,
        dataTypeOrOptions?: DataType | ModelAttributeColumnOptions,
        options?: QueryInterfaceOptions
    ): Promise<void>

    /**
     * Renames a column
     */
    public renameColumn(
        tableName: string | { schema?: string; tableName?: string },
        attrNameBefore: string,
        attrNameAfter: string,
        options?: QueryInterfaceOptions
    ): Promise<void>

    /**
     * Adds a new index to a table
     */
    public addIndex(
        tableName: string,
        attributes: string[],
        options?: QueryInterfaceIndexOptions,
        rawTablename?: string
    ): Promise<void>
    public addIndex(
        tableName: string,
        options: QueryInterfaceIndexOptions & { fields: string[] },
        rawTablename?: string
    ): Promise<void>

    /**
     * Removes an index of a table
     */
    public removeIndex(tableName: string, indexName: string, options?: QueryInterfaceIndexOptions): Promise<void>
    public removeIndex(tableName: string, attributes: string[], options?: QueryInterfaceIndexOptions): Promise<void>

    /**
     * Shows the index of a table
     */
    public showIndex(tableName: string | object, options?: QueryOptions): Promise<object>

    /**
     * Put a name to an index
     */
    public nameIndexes(indexes: string[], rawTablename: string): Promise<void>

    /**
     * Returns all foreign key constraints of a table
     */
    public getForeignKeysForTables(tableNames: string, options?: QueryInterfaceOptions): Promise<object>

    /**
     * Inserts a new record
     */
    public insert(instance: Model, tableName: string, values: object, options?: QueryOptions): Promise<object>

    /**
     * Inserts or Updates a record in the database
     */
    public upsert(
        tableName: string,
        values: object,
        updateValues: object,
        model: typeof Model,
        options?: QueryOptions
    ): Promise<object>

    /**
     * Inserts multiple records at once
     */
    public bulkInsert(
        tableName: string,
        records: object[],
        options?: QueryOptions,
        attributes?: string[] | string
    ): Promise<object>

    /**
     * Updates a row
     */
    public update(
        instance: Model,
        tableName: string,
        values: object,
        identifier: object,
        options?: QueryOptions
    ): Promise<object>

    /**
     * Updates multiple rows at once
     */
    public bulkUpdate(
        tableName: string,
        values: object,
        identifier: object,
        options?: QueryOptions,
        attributes?: string[] | string
    ): Promise<object>

    /**
     * Deletes a row
     */
    public delete(instance: Model, tableName: string, identifier: object, options?: QueryOptions): Promise<object>

    /**
     * Deletes multiple rows at once
     */
    public bulkDelete(
        tableName: string,
        identifier: object,
        options?: QueryOptions,
        model?: typeof Model
    ): Promise<object>

    /**
     * Returns selected rows
     */
    public select(model: typeof Model, tableName: string, options?: QueryOptions): Promise<object[]>

    /**
     * Increments a row value
     */
    public increment(
        instance: Model,
        tableName: string,
        values: object,
        identifier: object,
        options?: QueryOptions
    ): Promise<object>

    /**
     * Selects raw without parsing the string into an object
     */
    public rawSelect(
        tableName: string,
        options: QueryOptions,
        attributeSelector: string | string[],
        model?: typeof Model
    ): Promise<string[]>

    /**
     * Postgres only. Creates a trigger on specified table to call the specified function with supplied
     * parameters.
     */
    public createTrigger(
        tableName: string,
        triggerName: string,
        timingType: string,
        fireOnArray: any[],
        functionName: string,
        functionParams: any[],
        optionsArray: string[],
        options?: QueryInterfaceOptions
    ): Promise<void>

    /**
     * Postgres only. Drops the specified trigger.
     */
    public dropTrigger(tableName: string, triggerName: string, options?: QueryInterfaceOptions): Promise<void>

    /**
     * Postgres only. Renames a trigger
     */
    public renameTrigger(
        tableName: string,
        oldTriggerName: string,
        newTriggerName: string,
        options?: QueryInterfaceOptions
    ): Promise<void>

    /**
     * Postgres only. Create a function
     */
    public createFunction(
        functionName: string,
        params: any[],
        returnType: string,
        language: string,
        body: string,
        options?: QueryOptions
    ): Promise<void>

    /**
     * Postgres only. Drops a function
     */
    public dropFunction(functionName: string, params: any[], options?: QueryInterfaceOptions): Promise<void>

    /**
     * Postgres only. Rename a function
     */
    public renameFunction(
        oldFunctionName: string,
        params: any[],
        newFunctionName: string,
        options?: QueryInterfaceOptions
    ): Promise<void>

    /**
     * Escape an identifier (e.g. a table or attribute name). If force is true, the identifier will be quoted
     * even if the `quoteIdentifiers` option is false.
     */
    public quoteIdentifier(identifier: string, force: boolean): string

    /**
     * Escape a table name
     */
    public quoteTable(identifier: string): string

    /**
     * Split an identifier into .-separated tokens and quote each part. If force is true, the identifier will be
     * quoted even if the `quoteIdentifiers` option is false.
     */
    public quoteIdentifiers(identifiers: string, force: boolean): string

    /**
     * Escape a value (e.g. a string, number or date)
     */
    public escape(value?: string | number | Date): string

    /**
     * Set option for autocommit of a transaction
     */
    public setAutocommit(transaction: Transaction, value: boolean, options?: QueryOptions): Promise<void>

    /**
     * Set the isolation level of a transaction
     */
    public setIsolationLevel(transaction: Transaction, value: string, options?: QueryOptions): Promise<void>

    /**
     * Begin a new transaction
     */
    public startTransaction(transaction: Transaction, options?: QueryOptions): Promise<void>

    /**
     * Defer constraints
     */
    public deferConstraints(transaction: Transaction, options?: QueryOptions): Promise<void>

    /**
     * Commit an already started transaction
     */
    public commitTransaction(transaction: Transaction, options?: QueryOptions): Promise<void>

    /**
     * Rollback ( revert ) a transaction that has'nt been commited
     */
    public rollbackTransaction(transaction: Transaction, options?: QueryOptions): Promise<void>
}
