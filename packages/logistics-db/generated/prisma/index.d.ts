
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Shipment
 * 
 */
export type Shipment = $Result.DefaultSelection<Prisma.$ShipmentPayload>
/**
 * Model ShipmentEvent
 * 
 */
export type ShipmentEvent = $Result.DefaultSelection<Prisma.$ShipmentEventPayload>
/**
 * Model ShipmentItem
 * 
 */
export type ShipmentItem = $Result.DefaultSelection<Prisma.$ShipmentItemPayload>
/**
 * Model ShippingRate
 * 
 */
export type ShippingRate = $Result.DefaultSelection<Prisma.$ShippingRatePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ShipmentStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  LABEL_CREATED: 'LABEL_CREATED',
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED'
};

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus]

}

export type ShipmentStatus = $Enums.ShipmentStatus

export const ShipmentStatus: typeof $Enums.ShipmentStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Shipments
 * const shipments = await prisma.shipment.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Shipments
   * const shipments = await prisma.shipment.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.shipment`: Exposes CRUD operations for the **Shipment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Shipments
    * const shipments = await prisma.shipment.findMany()
    * ```
    */
  get shipment(): Prisma.ShipmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shipmentEvent`: Exposes CRUD operations for the **ShipmentEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShipmentEvents
    * const shipmentEvents = await prisma.shipmentEvent.findMany()
    * ```
    */
  get shipmentEvent(): Prisma.ShipmentEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shipmentItem`: Exposes CRUD operations for the **ShipmentItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShipmentItems
    * const shipmentItems = await prisma.shipmentItem.findMany()
    * ```
    */
  get shipmentItem(): Prisma.ShipmentItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shippingRate`: Exposes CRUD operations for the **ShippingRate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShippingRates
    * const shippingRates = await prisma.shippingRate.findMany()
    * ```
    */
  get shippingRate(): Prisma.ShippingRateDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Shipment: 'Shipment',
    ShipmentEvent: 'ShipmentEvent',
    ShipmentItem: 'ShipmentItem',
    ShippingRate: 'ShippingRate'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "shipment" | "shipmentEvent" | "shipmentItem" | "shippingRate"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Shipment: {
        payload: Prisma.$ShipmentPayload<ExtArgs>
        fields: Prisma.ShipmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShipmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShipmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          findFirst: {
            args: Prisma.ShipmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShipmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          findMany: {
            args: Prisma.ShipmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>[]
          }
          create: {
            args: Prisma.ShipmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          createMany: {
            args: Prisma.ShipmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShipmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>[]
          }
          delete: {
            args: Prisma.ShipmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          update: {
            args: Prisma.ShipmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          deleteMany: {
            args: Prisma.ShipmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShipmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShipmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>[]
          }
          upsert: {
            args: Prisma.ShipmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          aggregate: {
            args: Prisma.ShipmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipment>
          }
          groupBy: {
            args: Prisma.ShipmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShipmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShipmentCountArgs<ExtArgs>
            result: $Utils.Optional<ShipmentCountAggregateOutputType> | number
          }
        }
      }
      ShipmentEvent: {
        payload: Prisma.$ShipmentEventPayload<ExtArgs>
        fields: Prisma.ShipmentEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShipmentEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShipmentEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          findFirst: {
            args: Prisma.ShipmentEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShipmentEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          findMany: {
            args: Prisma.ShipmentEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>[]
          }
          create: {
            args: Prisma.ShipmentEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          createMany: {
            args: Prisma.ShipmentEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShipmentEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>[]
          }
          delete: {
            args: Prisma.ShipmentEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          update: {
            args: Prisma.ShipmentEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          deleteMany: {
            args: Prisma.ShipmentEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShipmentEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShipmentEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>[]
          }
          upsert: {
            args: Prisma.ShipmentEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          aggregate: {
            args: Prisma.ShipmentEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipmentEvent>
          }
          groupBy: {
            args: Prisma.ShipmentEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShipmentEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShipmentEventCountArgs<ExtArgs>
            result: $Utils.Optional<ShipmentEventCountAggregateOutputType> | number
          }
        }
      }
      ShipmentItem: {
        payload: Prisma.$ShipmentItemPayload<ExtArgs>
        fields: Prisma.ShipmentItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShipmentItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShipmentItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          findFirst: {
            args: Prisma.ShipmentItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShipmentItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          findMany: {
            args: Prisma.ShipmentItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>[]
          }
          create: {
            args: Prisma.ShipmentItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          createMany: {
            args: Prisma.ShipmentItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShipmentItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>[]
          }
          delete: {
            args: Prisma.ShipmentItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          update: {
            args: Prisma.ShipmentItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          deleteMany: {
            args: Prisma.ShipmentItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShipmentItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShipmentItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>[]
          }
          upsert: {
            args: Prisma.ShipmentItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          aggregate: {
            args: Prisma.ShipmentItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipmentItem>
          }
          groupBy: {
            args: Prisma.ShipmentItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShipmentItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShipmentItemCountArgs<ExtArgs>
            result: $Utils.Optional<ShipmentItemCountAggregateOutputType> | number
          }
        }
      }
      ShippingRate: {
        payload: Prisma.$ShippingRatePayload<ExtArgs>
        fields: Prisma.ShippingRateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShippingRateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShippingRateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload>
          }
          findFirst: {
            args: Prisma.ShippingRateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShippingRateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload>
          }
          findMany: {
            args: Prisma.ShippingRateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload>[]
          }
          create: {
            args: Prisma.ShippingRateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload>
          }
          createMany: {
            args: Prisma.ShippingRateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShippingRateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload>[]
          }
          delete: {
            args: Prisma.ShippingRateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload>
          }
          update: {
            args: Prisma.ShippingRateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload>
          }
          deleteMany: {
            args: Prisma.ShippingRateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShippingRateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShippingRateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload>[]
          }
          upsert: {
            args: Prisma.ShippingRateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShippingRatePayload>
          }
          aggregate: {
            args: Prisma.ShippingRateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShippingRate>
          }
          groupBy: {
            args: Prisma.ShippingRateGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShippingRateGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShippingRateCountArgs<ExtArgs>
            result: $Utils.Optional<ShippingRateCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    shipment?: ShipmentOmit
    shipmentEvent?: ShipmentEventOmit
    shipmentItem?: ShipmentItemOmit
    shippingRate?: ShippingRateOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ShipmentCountOutputType
   */

  export type ShipmentCountOutputType = {
    events: number
    items: number
  }

  export type ShipmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | ShipmentCountOutputTypeCountEventsArgs
    items?: boolean | ShipmentCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * ShipmentCountOutputType without action
   */
  export type ShipmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentCountOutputType
     */
    select?: ShipmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ShipmentCountOutputType without action
   */
  export type ShipmentCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentEventWhereInput
  }

  /**
   * ShipmentCountOutputType without action
   */
  export type ShipmentCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Shipment
   */

  export type AggregateShipment = {
    _count: ShipmentCountAggregateOutputType | null
    _avg: ShipmentAvgAggregateOutputType | null
    _sum: ShipmentSumAggregateOutputType | null
    _min: ShipmentMinAggregateOutputType | null
    _max: ShipmentMaxAggregateOutputType | null
  }

  export type ShipmentAvgAggregateOutputType = {
    shippingCost: number | null
    weight: number | null
  }

  export type ShipmentSumAggregateOutputType = {
    shippingCost: number | null
    weight: number | null
  }

  export type ShipmentMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    userId: string | null
    carrier: string | null
    trackingNumber: string | null
    trackingUrl: string | null
    serviceLevel: string | null
    status: $Enums.ShipmentStatus | null
    estimatedDelivery: Date | null
    shippedAt: Date | null
    deliveredAt: Date | null
    shippingCost: number | null
    weight: number | null
    currency: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShipmentMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    userId: string | null
    carrier: string | null
    trackingNumber: string | null
    trackingUrl: string | null
    serviceLevel: string | null
    status: $Enums.ShipmentStatus | null
    estimatedDelivery: Date | null
    shippedAt: Date | null
    deliveredAt: Date | null
    shippingCost: number | null
    weight: number | null
    currency: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShipmentCountAggregateOutputType = {
    id: number
    orderId: number
    userId: number
    carrier: number
    trackingNumber: number
    trackingUrl: number
    serviceLevel: number
    status: number
    estimatedDelivery: number
    shippedAt: number
    deliveredAt: number
    shippingCost: number
    weight: number
    currency: number
    originAddress: number
    destinationAddress: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ShipmentAvgAggregateInputType = {
    shippingCost?: true
    weight?: true
  }

  export type ShipmentSumAggregateInputType = {
    shippingCost?: true
    weight?: true
  }

  export type ShipmentMinAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    carrier?: true
    trackingNumber?: true
    trackingUrl?: true
    serviceLevel?: true
    status?: true
    estimatedDelivery?: true
    shippedAt?: true
    deliveredAt?: true
    shippingCost?: true
    weight?: true
    currency?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShipmentMaxAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    carrier?: true
    trackingNumber?: true
    trackingUrl?: true
    serviceLevel?: true
    status?: true
    estimatedDelivery?: true
    shippedAt?: true
    deliveredAt?: true
    shippingCost?: true
    weight?: true
    currency?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShipmentCountAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    carrier?: true
    trackingNumber?: true
    trackingUrl?: true
    serviceLevel?: true
    status?: true
    estimatedDelivery?: true
    shippedAt?: true
    deliveredAt?: true
    shippingCost?: true
    weight?: true
    currency?: true
    originAddress?: true
    destinationAddress?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ShipmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shipment to aggregate.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Shipments
    **/
    _count?: true | ShipmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShipmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShipmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShipmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShipmentMaxAggregateInputType
  }

  export type GetShipmentAggregateType<T extends ShipmentAggregateArgs> = {
        [P in keyof T & keyof AggregateShipment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipment[P]>
      : GetScalarType<T[P], AggregateShipment[P]>
  }




  export type ShipmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentWhereInput
    orderBy?: ShipmentOrderByWithAggregationInput | ShipmentOrderByWithAggregationInput[]
    by: ShipmentScalarFieldEnum[] | ShipmentScalarFieldEnum
    having?: ShipmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShipmentCountAggregateInputType | true
    _avg?: ShipmentAvgAggregateInputType
    _sum?: ShipmentSumAggregateInputType
    _min?: ShipmentMinAggregateInputType
    _max?: ShipmentMaxAggregateInputType
  }

  export type ShipmentGroupByOutputType = {
    id: string
    orderId: string
    userId: string
    carrier: string | null
    trackingNumber: string | null
    trackingUrl: string | null
    serviceLevel: string | null
    status: $Enums.ShipmentStatus
    estimatedDelivery: Date | null
    shippedAt: Date | null
    deliveredAt: Date | null
    shippingCost: number | null
    weight: number | null
    currency: string
    originAddress: JsonValue | null
    destinationAddress: JsonValue
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: ShipmentCountAggregateOutputType | null
    _avg: ShipmentAvgAggregateOutputType | null
    _sum: ShipmentSumAggregateOutputType | null
    _min: ShipmentMinAggregateOutputType | null
    _max: ShipmentMaxAggregateOutputType | null
  }

  type GetShipmentGroupByPayload<T extends ShipmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShipmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShipmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShipmentGroupByOutputType[P]>
            : GetScalarType<T[P], ShipmentGroupByOutputType[P]>
        }
      >
    >


  export type ShipmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    carrier?: boolean
    trackingNumber?: boolean
    trackingUrl?: boolean
    serviceLevel?: boolean
    status?: boolean
    estimatedDelivery?: boolean
    shippedAt?: boolean
    deliveredAt?: boolean
    shippingCost?: boolean
    weight?: boolean
    currency?: boolean
    originAddress?: boolean
    destinationAddress?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    events?: boolean | Shipment$eventsArgs<ExtArgs>
    items?: boolean | Shipment$itemsArgs<ExtArgs>
    _count?: boolean | ShipmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipment"]>

  export type ShipmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    carrier?: boolean
    trackingNumber?: boolean
    trackingUrl?: boolean
    serviceLevel?: boolean
    status?: boolean
    estimatedDelivery?: boolean
    shippedAt?: boolean
    deliveredAt?: boolean
    shippingCost?: boolean
    weight?: boolean
    currency?: boolean
    originAddress?: boolean
    destinationAddress?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shipment"]>

  export type ShipmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    carrier?: boolean
    trackingNumber?: boolean
    trackingUrl?: boolean
    serviceLevel?: boolean
    status?: boolean
    estimatedDelivery?: boolean
    shippedAt?: boolean
    deliveredAt?: boolean
    shippingCost?: boolean
    weight?: boolean
    currency?: boolean
    originAddress?: boolean
    destinationAddress?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shipment"]>

  export type ShipmentSelectScalar = {
    id?: boolean
    orderId?: boolean
    userId?: boolean
    carrier?: boolean
    trackingNumber?: boolean
    trackingUrl?: boolean
    serviceLevel?: boolean
    status?: boolean
    estimatedDelivery?: boolean
    shippedAt?: boolean
    deliveredAt?: boolean
    shippingCost?: boolean
    weight?: boolean
    currency?: boolean
    originAddress?: boolean
    destinationAddress?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ShipmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "userId" | "carrier" | "trackingNumber" | "trackingUrl" | "serviceLevel" | "status" | "estimatedDelivery" | "shippedAt" | "deliveredAt" | "shippingCost" | "weight" | "currency" | "originAddress" | "destinationAddress" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["shipment"]>
  export type ShipmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | Shipment$eventsArgs<ExtArgs>
    items?: boolean | Shipment$itemsArgs<ExtArgs>
    _count?: boolean | ShipmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ShipmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ShipmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ShipmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Shipment"
    objects: {
      events: Prisma.$ShipmentEventPayload<ExtArgs>[]
      items: Prisma.$ShipmentItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      userId: string
      carrier: string | null
      trackingNumber: string | null
      trackingUrl: string | null
      serviceLevel: string | null
      status: $Enums.ShipmentStatus
      estimatedDelivery: Date | null
      shippedAt: Date | null
      deliveredAt: Date | null
      shippingCost: number | null
      weight: number | null
      currency: string
      originAddress: Prisma.JsonValue | null
      destinationAddress: Prisma.JsonValue
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["shipment"]>
    composites: {}
  }

  type ShipmentGetPayload<S extends boolean | null | undefined | ShipmentDefaultArgs> = $Result.GetResult<Prisma.$ShipmentPayload, S>

  type ShipmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShipmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShipmentCountAggregateInputType | true
    }

  export interface ShipmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Shipment'], meta: { name: 'Shipment' } }
    /**
     * Find zero or one Shipment that matches the filter.
     * @param {ShipmentFindUniqueArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShipmentFindUniqueArgs>(args: SelectSubset<T, ShipmentFindUniqueArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Shipment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShipmentFindUniqueOrThrowArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShipmentFindUniqueOrThrowArgs>(args: SelectSubset<T, ShipmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shipment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentFindFirstArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShipmentFindFirstArgs>(args?: SelectSubset<T, ShipmentFindFirstArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shipment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentFindFirstOrThrowArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShipmentFindFirstOrThrowArgs>(args?: SelectSubset<T, ShipmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Shipments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Shipments
     * const shipments = await prisma.shipment.findMany()
     * 
     * // Get first 10 Shipments
     * const shipments = await prisma.shipment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shipmentWithIdOnly = await prisma.shipment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShipmentFindManyArgs>(args?: SelectSubset<T, ShipmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Shipment.
     * @param {ShipmentCreateArgs} args - Arguments to create a Shipment.
     * @example
     * // Create one Shipment
     * const Shipment = await prisma.shipment.create({
     *   data: {
     *     // ... data to create a Shipment
     *   }
     * })
     * 
     */
    create<T extends ShipmentCreateArgs>(args: SelectSubset<T, ShipmentCreateArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Shipments.
     * @param {ShipmentCreateManyArgs} args - Arguments to create many Shipments.
     * @example
     * // Create many Shipments
     * const shipment = await prisma.shipment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShipmentCreateManyArgs>(args?: SelectSubset<T, ShipmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Shipments and returns the data saved in the database.
     * @param {ShipmentCreateManyAndReturnArgs} args - Arguments to create many Shipments.
     * @example
     * // Create many Shipments
     * const shipment = await prisma.shipment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Shipments and only return the `id`
     * const shipmentWithIdOnly = await prisma.shipment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShipmentCreateManyAndReturnArgs>(args?: SelectSubset<T, ShipmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Shipment.
     * @param {ShipmentDeleteArgs} args - Arguments to delete one Shipment.
     * @example
     * // Delete one Shipment
     * const Shipment = await prisma.shipment.delete({
     *   where: {
     *     // ... filter to delete one Shipment
     *   }
     * })
     * 
     */
    delete<T extends ShipmentDeleteArgs>(args: SelectSubset<T, ShipmentDeleteArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Shipment.
     * @param {ShipmentUpdateArgs} args - Arguments to update one Shipment.
     * @example
     * // Update one Shipment
     * const shipment = await prisma.shipment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShipmentUpdateArgs>(args: SelectSubset<T, ShipmentUpdateArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Shipments.
     * @param {ShipmentDeleteManyArgs} args - Arguments to filter Shipments to delete.
     * @example
     * // Delete a few Shipments
     * const { count } = await prisma.shipment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShipmentDeleteManyArgs>(args?: SelectSubset<T, ShipmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shipments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Shipments
     * const shipment = await prisma.shipment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShipmentUpdateManyArgs>(args: SelectSubset<T, ShipmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shipments and returns the data updated in the database.
     * @param {ShipmentUpdateManyAndReturnArgs} args - Arguments to update many Shipments.
     * @example
     * // Update many Shipments
     * const shipment = await prisma.shipment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Shipments and only return the `id`
     * const shipmentWithIdOnly = await prisma.shipment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShipmentUpdateManyAndReturnArgs>(args: SelectSubset<T, ShipmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Shipment.
     * @param {ShipmentUpsertArgs} args - Arguments to update or create a Shipment.
     * @example
     * // Update or create a Shipment
     * const shipment = await prisma.shipment.upsert({
     *   create: {
     *     // ... data to create a Shipment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Shipment we want to update
     *   }
     * })
     */
    upsert<T extends ShipmentUpsertArgs>(args: SelectSubset<T, ShipmentUpsertArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Shipments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentCountArgs} args - Arguments to filter Shipments to count.
     * @example
     * // Count the number of Shipments
     * const count = await prisma.shipment.count({
     *   where: {
     *     // ... the filter for the Shipments we want to count
     *   }
     * })
    **/
    count<T extends ShipmentCountArgs>(
      args?: Subset<T, ShipmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShipmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Shipment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShipmentAggregateArgs>(args: Subset<T, ShipmentAggregateArgs>): Prisma.PrismaPromise<GetShipmentAggregateType<T>>

    /**
     * Group by Shipment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShipmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShipmentGroupByArgs['orderBy'] }
        : { orderBy?: ShipmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShipmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShipmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Shipment model
   */
  readonly fields: ShipmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Shipment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShipmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    events<T extends Shipment$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Shipment$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    items<T extends Shipment$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Shipment$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Shipment model
   */
  interface ShipmentFieldRefs {
    readonly id: FieldRef<"Shipment", 'String'>
    readonly orderId: FieldRef<"Shipment", 'String'>
    readonly userId: FieldRef<"Shipment", 'String'>
    readonly carrier: FieldRef<"Shipment", 'String'>
    readonly trackingNumber: FieldRef<"Shipment", 'String'>
    readonly trackingUrl: FieldRef<"Shipment", 'String'>
    readonly serviceLevel: FieldRef<"Shipment", 'String'>
    readonly status: FieldRef<"Shipment", 'ShipmentStatus'>
    readonly estimatedDelivery: FieldRef<"Shipment", 'DateTime'>
    readonly shippedAt: FieldRef<"Shipment", 'DateTime'>
    readonly deliveredAt: FieldRef<"Shipment", 'DateTime'>
    readonly shippingCost: FieldRef<"Shipment", 'Float'>
    readonly weight: FieldRef<"Shipment", 'Float'>
    readonly currency: FieldRef<"Shipment", 'String'>
    readonly originAddress: FieldRef<"Shipment", 'Json'>
    readonly destinationAddress: FieldRef<"Shipment", 'Json'>
    readonly notes: FieldRef<"Shipment", 'String'>
    readonly createdAt: FieldRef<"Shipment", 'DateTime'>
    readonly updatedAt: FieldRef<"Shipment", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Shipment findUnique
   */
  export type ShipmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment findUniqueOrThrow
   */
  export type ShipmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment findFirst
   */
  export type ShipmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shipments.
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shipments.
     */
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Shipment findFirstOrThrow
   */
  export type ShipmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shipments.
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shipments.
     */
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Shipment findMany
   */
  export type ShipmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipments to fetch.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Shipments.
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Shipment create
   */
  export type ShipmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Shipment.
     */
    data: XOR<ShipmentCreateInput, ShipmentUncheckedCreateInput>
  }

  /**
   * Shipment createMany
   */
  export type ShipmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Shipments.
     */
    data: ShipmentCreateManyInput | ShipmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shipment createManyAndReturn
   */
  export type ShipmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * The data used to create many Shipments.
     */
    data: ShipmentCreateManyInput | ShipmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shipment update
   */
  export type ShipmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Shipment.
     */
    data: XOR<ShipmentUpdateInput, ShipmentUncheckedUpdateInput>
    /**
     * Choose, which Shipment to update.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment updateMany
   */
  export type ShipmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Shipments.
     */
    data: XOR<ShipmentUpdateManyMutationInput, ShipmentUncheckedUpdateManyInput>
    /**
     * Filter which Shipments to update
     */
    where?: ShipmentWhereInput
    /**
     * Limit how many Shipments to update.
     */
    limit?: number
  }

  /**
   * Shipment updateManyAndReturn
   */
  export type ShipmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * The data used to update Shipments.
     */
    data: XOR<ShipmentUpdateManyMutationInput, ShipmentUncheckedUpdateManyInput>
    /**
     * Filter which Shipments to update
     */
    where?: ShipmentWhereInput
    /**
     * Limit how many Shipments to update.
     */
    limit?: number
  }

  /**
   * Shipment upsert
   */
  export type ShipmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Shipment to update in case it exists.
     */
    where: ShipmentWhereUniqueInput
    /**
     * In case the Shipment found by the `where` argument doesn't exist, create a new Shipment with this data.
     */
    create: XOR<ShipmentCreateInput, ShipmentUncheckedCreateInput>
    /**
     * In case the Shipment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShipmentUpdateInput, ShipmentUncheckedUpdateInput>
  }

  /**
   * Shipment delete
   */
  export type ShipmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter which Shipment to delete.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment deleteMany
   */
  export type ShipmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shipments to delete
     */
    where?: ShipmentWhereInput
    /**
     * Limit how many Shipments to delete.
     */
    limit?: number
  }

  /**
   * Shipment.events
   */
  export type Shipment$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    where?: ShipmentEventWhereInput
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    cursor?: ShipmentEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShipmentEventScalarFieldEnum | ShipmentEventScalarFieldEnum[]
  }

  /**
   * Shipment.items
   */
  export type Shipment$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    where?: ShipmentItemWhereInput
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    cursor?: ShipmentItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * Shipment without action
   */
  export type ShipmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
  }


  /**
   * Model ShipmentEvent
   */

  export type AggregateShipmentEvent = {
    _count: ShipmentEventCountAggregateOutputType | null
    _min: ShipmentEventMinAggregateOutputType | null
    _max: ShipmentEventMaxAggregateOutputType | null
  }

  export type ShipmentEventMinAggregateOutputType = {
    id: string | null
    shipmentId: string | null
    status: $Enums.ShipmentStatus | null
    location: string | null
    description: string | null
    occurredAt: Date | null
  }

  export type ShipmentEventMaxAggregateOutputType = {
    id: string | null
    shipmentId: string | null
    status: $Enums.ShipmentStatus | null
    location: string | null
    description: string | null
    occurredAt: Date | null
  }

  export type ShipmentEventCountAggregateOutputType = {
    id: number
    shipmentId: number
    status: number
    location: number
    description: number
    occurredAt: number
    _all: number
  }


  export type ShipmentEventMinAggregateInputType = {
    id?: true
    shipmentId?: true
    status?: true
    location?: true
    description?: true
    occurredAt?: true
  }

  export type ShipmentEventMaxAggregateInputType = {
    id?: true
    shipmentId?: true
    status?: true
    location?: true
    description?: true
    occurredAt?: true
  }

  export type ShipmentEventCountAggregateInputType = {
    id?: true
    shipmentId?: true
    status?: true
    location?: true
    description?: true
    occurredAt?: true
    _all?: true
  }

  export type ShipmentEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentEvent to aggregate.
     */
    where?: ShipmentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentEvents to fetch.
     */
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShipmentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShipmentEvents
    **/
    _count?: true | ShipmentEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShipmentEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShipmentEventMaxAggregateInputType
  }

  export type GetShipmentEventAggregateType<T extends ShipmentEventAggregateArgs> = {
        [P in keyof T & keyof AggregateShipmentEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipmentEvent[P]>
      : GetScalarType<T[P], AggregateShipmentEvent[P]>
  }




  export type ShipmentEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentEventWhereInput
    orderBy?: ShipmentEventOrderByWithAggregationInput | ShipmentEventOrderByWithAggregationInput[]
    by: ShipmentEventScalarFieldEnum[] | ShipmentEventScalarFieldEnum
    having?: ShipmentEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShipmentEventCountAggregateInputType | true
    _min?: ShipmentEventMinAggregateInputType
    _max?: ShipmentEventMaxAggregateInputType
  }

  export type ShipmentEventGroupByOutputType = {
    id: string
    shipmentId: string
    status: $Enums.ShipmentStatus
    location: string | null
    description: string | null
    occurredAt: Date
    _count: ShipmentEventCountAggregateOutputType | null
    _min: ShipmentEventMinAggregateOutputType | null
    _max: ShipmentEventMaxAggregateOutputType | null
  }

  type GetShipmentEventGroupByPayload<T extends ShipmentEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShipmentEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShipmentEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShipmentEventGroupByOutputType[P]>
            : GetScalarType<T[P], ShipmentEventGroupByOutputType[P]>
        }
      >
    >


  export type ShipmentEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    occurredAt?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentEvent"]>

  export type ShipmentEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    occurredAt?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentEvent"]>

  export type ShipmentEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    occurredAt?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentEvent"]>

  export type ShipmentEventSelectScalar = {
    id?: boolean
    shipmentId?: boolean
    status?: boolean
    location?: boolean
    description?: boolean
    occurredAt?: boolean
  }

  export type ShipmentEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shipmentId" | "status" | "location" | "description" | "occurredAt", ExtArgs["result"]["shipmentEvent"]>
  export type ShipmentEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }
  export type ShipmentEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }
  export type ShipmentEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }

  export type $ShipmentEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShipmentEvent"
    objects: {
      shipment: Prisma.$ShipmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shipmentId: string
      status: $Enums.ShipmentStatus
      location: string | null
      description: string | null
      occurredAt: Date
    }, ExtArgs["result"]["shipmentEvent"]>
    composites: {}
  }

  type ShipmentEventGetPayload<S extends boolean | null | undefined | ShipmentEventDefaultArgs> = $Result.GetResult<Prisma.$ShipmentEventPayload, S>

  type ShipmentEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShipmentEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShipmentEventCountAggregateInputType | true
    }

  export interface ShipmentEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShipmentEvent'], meta: { name: 'ShipmentEvent' } }
    /**
     * Find zero or one ShipmentEvent that matches the filter.
     * @param {ShipmentEventFindUniqueArgs} args - Arguments to find a ShipmentEvent
     * @example
     * // Get one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShipmentEventFindUniqueArgs>(args: SelectSubset<T, ShipmentEventFindUniqueArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ShipmentEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShipmentEventFindUniqueOrThrowArgs} args - Arguments to find a ShipmentEvent
     * @example
     * // Get one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShipmentEventFindUniqueOrThrowArgs>(args: SelectSubset<T, ShipmentEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventFindFirstArgs} args - Arguments to find a ShipmentEvent
     * @example
     * // Get one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShipmentEventFindFirstArgs>(args?: SelectSubset<T, ShipmentEventFindFirstArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventFindFirstOrThrowArgs} args - Arguments to find a ShipmentEvent
     * @example
     * // Get one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShipmentEventFindFirstOrThrowArgs>(args?: SelectSubset<T, ShipmentEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ShipmentEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShipmentEvents
     * const shipmentEvents = await prisma.shipmentEvent.findMany()
     * 
     * // Get first 10 ShipmentEvents
     * const shipmentEvents = await prisma.shipmentEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shipmentEventWithIdOnly = await prisma.shipmentEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShipmentEventFindManyArgs>(args?: SelectSubset<T, ShipmentEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ShipmentEvent.
     * @param {ShipmentEventCreateArgs} args - Arguments to create a ShipmentEvent.
     * @example
     * // Create one ShipmentEvent
     * const ShipmentEvent = await prisma.shipmentEvent.create({
     *   data: {
     *     // ... data to create a ShipmentEvent
     *   }
     * })
     * 
     */
    create<T extends ShipmentEventCreateArgs>(args: SelectSubset<T, ShipmentEventCreateArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ShipmentEvents.
     * @param {ShipmentEventCreateManyArgs} args - Arguments to create many ShipmentEvents.
     * @example
     * // Create many ShipmentEvents
     * const shipmentEvent = await prisma.shipmentEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShipmentEventCreateManyArgs>(args?: SelectSubset<T, ShipmentEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShipmentEvents and returns the data saved in the database.
     * @param {ShipmentEventCreateManyAndReturnArgs} args - Arguments to create many ShipmentEvents.
     * @example
     * // Create many ShipmentEvents
     * const shipmentEvent = await prisma.shipmentEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShipmentEvents and only return the `id`
     * const shipmentEventWithIdOnly = await prisma.shipmentEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShipmentEventCreateManyAndReturnArgs>(args?: SelectSubset<T, ShipmentEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ShipmentEvent.
     * @param {ShipmentEventDeleteArgs} args - Arguments to delete one ShipmentEvent.
     * @example
     * // Delete one ShipmentEvent
     * const ShipmentEvent = await prisma.shipmentEvent.delete({
     *   where: {
     *     // ... filter to delete one ShipmentEvent
     *   }
     * })
     * 
     */
    delete<T extends ShipmentEventDeleteArgs>(args: SelectSubset<T, ShipmentEventDeleteArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ShipmentEvent.
     * @param {ShipmentEventUpdateArgs} args - Arguments to update one ShipmentEvent.
     * @example
     * // Update one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShipmentEventUpdateArgs>(args: SelectSubset<T, ShipmentEventUpdateArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ShipmentEvents.
     * @param {ShipmentEventDeleteManyArgs} args - Arguments to filter ShipmentEvents to delete.
     * @example
     * // Delete a few ShipmentEvents
     * const { count } = await prisma.shipmentEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShipmentEventDeleteManyArgs>(args?: SelectSubset<T, ShipmentEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShipmentEvents
     * const shipmentEvent = await prisma.shipmentEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShipmentEventUpdateManyArgs>(args: SelectSubset<T, ShipmentEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentEvents and returns the data updated in the database.
     * @param {ShipmentEventUpdateManyAndReturnArgs} args - Arguments to update many ShipmentEvents.
     * @example
     * // Update many ShipmentEvents
     * const shipmentEvent = await prisma.shipmentEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ShipmentEvents and only return the `id`
     * const shipmentEventWithIdOnly = await prisma.shipmentEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShipmentEventUpdateManyAndReturnArgs>(args: SelectSubset<T, ShipmentEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ShipmentEvent.
     * @param {ShipmentEventUpsertArgs} args - Arguments to update or create a ShipmentEvent.
     * @example
     * // Update or create a ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.upsert({
     *   create: {
     *     // ... data to create a ShipmentEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShipmentEvent we want to update
     *   }
     * })
     */
    upsert<T extends ShipmentEventUpsertArgs>(args: SelectSubset<T, ShipmentEventUpsertArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ShipmentEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventCountArgs} args - Arguments to filter ShipmentEvents to count.
     * @example
     * // Count the number of ShipmentEvents
     * const count = await prisma.shipmentEvent.count({
     *   where: {
     *     // ... the filter for the ShipmentEvents we want to count
     *   }
     * })
    **/
    count<T extends ShipmentEventCountArgs>(
      args?: Subset<T, ShipmentEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShipmentEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShipmentEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShipmentEventAggregateArgs>(args: Subset<T, ShipmentEventAggregateArgs>): Prisma.PrismaPromise<GetShipmentEventAggregateType<T>>

    /**
     * Group by ShipmentEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShipmentEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShipmentEventGroupByArgs['orderBy'] }
        : { orderBy?: ShipmentEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShipmentEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShipmentEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShipmentEvent model
   */
  readonly fields: ShipmentEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShipmentEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShipmentEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shipment<T extends ShipmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShipmentDefaultArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShipmentEvent model
   */
  interface ShipmentEventFieldRefs {
    readonly id: FieldRef<"ShipmentEvent", 'String'>
    readonly shipmentId: FieldRef<"ShipmentEvent", 'String'>
    readonly status: FieldRef<"ShipmentEvent", 'ShipmentStatus'>
    readonly location: FieldRef<"ShipmentEvent", 'String'>
    readonly description: FieldRef<"ShipmentEvent", 'String'>
    readonly occurredAt: FieldRef<"ShipmentEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ShipmentEvent findUnique
   */
  export type ShipmentEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvent to fetch.
     */
    where: ShipmentEventWhereUniqueInput
  }

  /**
   * ShipmentEvent findUniqueOrThrow
   */
  export type ShipmentEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvent to fetch.
     */
    where: ShipmentEventWhereUniqueInput
  }

  /**
   * ShipmentEvent findFirst
   */
  export type ShipmentEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvent to fetch.
     */
    where?: ShipmentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentEvents to fetch.
     */
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentEvents.
     */
    cursor?: ShipmentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentEvents.
     */
    distinct?: ShipmentEventScalarFieldEnum | ShipmentEventScalarFieldEnum[]
  }

  /**
   * ShipmentEvent findFirstOrThrow
   */
  export type ShipmentEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvent to fetch.
     */
    where?: ShipmentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentEvents to fetch.
     */
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentEvents.
     */
    cursor?: ShipmentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentEvents.
     */
    distinct?: ShipmentEventScalarFieldEnum | ShipmentEventScalarFieldEnum[]
  }

  /**
   * ShipmentEvent findMany
   */
  export type ShipmentEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvents to fetch.
     */
    where?: ShipmentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentEvents to fetch.
     */
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShipmentEvents.
     */
    cursor?: ShipmentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentEvents.
     */
    skip?: number
    distinct?: ShipmentEventScalarFieldEnum | ShipmentEventScalarFieldEnum[]
  }

  /**
   * ShipmentEvent create
   */
  export type ShipmentEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * The data needed to create a ShipmentEvent.
     */
    data: XOR<ShipmentEventCreateInput, ShipmentEventUncheckedCreateInput>
  }

  /**
   * ShipmentEvent createMany
   */
  export type ShipmentEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShipmentEvents.
     */
    data: ShipmentEventCreateManyInput | ShipmentEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShipmentEvent createManyAndReturn
   */
  export type ShipmentEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * The data used to create many ShipmentEvents.
     */
    data: ShipmentEventCreateManyInput | ShipmentEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentEvent update
   */
  export type ShipmentEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * The data needed to update a ShipmentEvent.
     */
    data: XOR<ShipmentEventUpdateInput, ShipmentEventUncheckedUpdateInput>
    /**
     * Choose, which ShipmentEvent to update.
     */
    where: ShipmentEventWhereUniqueInput
  }

  /**
   * ShipmentEvent updateMany
   */
  export type ShipmentEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShipmentEvents.
     */
    data: XOR<ShipmentEventUpdateManyMutationInput, ShipmentEventUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentEvents to update
     */
    where?: ShipmentEventWhereInput
    /**
     * Limit how many ShipmentEvents to update.
     */
    limit?: number
  }

  /**
   * ShipmentEvent updateManyAndReturn
   */
  export type ShipmentEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * The data used to update ShipmentEvents.
     */
    data: XOR<ShipmentEventUpdateManyMutationInput, ShipmentEventUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentEvents to update
     */
    where?: ShipmentEventWhereInput
    /**
     * Limit how many ShipmentEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentEvent upsert
   */
  export type ShipmentEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * The filter to search for the ShipmentEvent to update in case it exists.
     */
    where: ShipmentEventWhereUniqueInput
    /**
     * In case the ShipmentEvent found by the `where` argument doesn't exist, create a new ShipmentEvent with this data.
     */
    create: XOR<ShipmentEventCreateInput, ShipmentEventUncheckedCreateInput>
    /**
     * In case the ShipmentEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShipmentEventUpdateInput, ShipmentEventUncheckedUpdateInput>
  }

  /**
   * ShipmentEvent delete
   */
  export type ShipmentEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter which ShipmentEvent to delete.
     */
    where: ShipmentEventWhereUniqueInput
  }

  /**
   * ShipmentEvent deleteMany
   */
  export type ShipmentEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentEvents to delete
     */
    where?: ShipmentEventWhereInput
    /**
     * Limit how many ShipmentEvents to delete.
     */
    limit?: number
  }

  /**
   * ShipmentEvent without action
   */
  export type ShipmentEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
  }


  /**
   * Model ShipmentItem
   */

  export type AggregateShipmentItem = {
    _count: ShipmentItemCountAggregateOutputType | null
    _avg: ShipmentItemAvgAggregateOutputType | null
    _sum: ShipmentItemSumAggregateOutputType | null
    _min: ShipmentItemMinAggregateOutputType | null
    _max: ShipmentItemMaxAggregateOutputType | null
  }

  export type ShipmentItemAvgAggregateOutputType = {
    quantity: number | null
  }

  export type ShipmentItemSumAggregateOutputType = {
    quantity: number | null
  }

  export type ShipmentItemMinAggregateOutputType = {
    id: string | null
    shipmentId: string | null
    productId: string | null
    sku: string | null
    productName: string | null
    quantity: number | null
  }

  export type ShipmentItemMaxAggregateOutputType = {
    id: string | null
    shipmentId: string | null
    productId: string | null
    sku: string | null
    productName: string | null
    quantity: number | null
  }

  export type ShipmentItemCountAggregateOutputType = {
    id: number
    shipmentId: number
    productId: number
    sku: number
    productName: number
    quantity: number
    _all: number
  }


  export type ShipmentItemAvgAggregateInputType = {
    quantity?: true
  }

  export type ShipmentItemSumAggregateInputType = {
    quantity?: true
  }

  export type ShipmentItemMinAggregateInputType = {
    id?: true
    shipmentId?: true
    productId?: true
    sku?: true
    productName?: true
    quantity?: true
  }

  export type ShipmentItemMaxAggregateInputType = {
    id?: true
    shipmentId?: true
    productId?: true
    sku?: true
    productName?: true
    quantity?: true
  }

  export type ShipmentItemCountAggregateInputType = {
    id?: true
    shipmentId?: true
    productId?: true
    sku?: true
    productName?: true
    quantity?: true
    _all?: true
  }

  export type ShipmentItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentItem to aggregate.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShipmentItems
    **/
    _count?: true | ShipmentItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShipmentItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShipmentItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShipmentItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShipmentItemMaxAggregateInputType
  }

  export type GetShipmentItemAggregateType<T extends ShipmentItemAggregateArgs> = {
        [P in keyof T & keyof AggregateShipmentItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipmentItem[P]>
      : GetScalarType<T[P], AggregateShipmentItem[P]>
  }




  export type ShipmentItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentItemWhereInput
    orderBy?: ShipmentItemOrderByWithAggregationInput | ShipmentItemOrderByWithAggregationInput[]
    by: ShipmentItemScalarFieldEnum[] | ShipmentItemScalarFieldEnum
    having?: ShipmentItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShipmentItemCountAggregateInputType | true
    _avg?: ShipmentItemAvgAggregateInputType
    _sum?: ShipmentItemSumAggregateInputType
    _min?: ShipmentItemMinAggregateInputType
    _max?: ShipmentItemMaxAggregateInputType
  }

  export type ShipmentItemGroupByOutputType = {
    id: string
    shipmentId: string
    productId: string
    sku: string | null
    productName: string | null
    quantity: number
    _count: ShipmentItemCountAggregateOutputType | null
    _avg: ShipmentItemAvgAggregateOutputType | null
    _sum: ShipmentItemSumAggregateOutputType | null
    _min: ShipmentItemMinAggregateOutputType | null
    _max: ShipmentItemMaxAggregateOutputType | null
  }

  type GetShipmentItemGroupByPayload<T extends ShipmentItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShipmentItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShipmentItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShipmentItemGroupByOutputType[P]>
            : GetScalarType<T[P], ShipmentItemGroupByOutputType[P]>
        }
      >
    >


  export type ShipmentItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    productId?: boolean
    sku?: boolean
    productName?: boolean
    quantity?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentItem"]>

  export type ShipmentItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    productId?: boolean
    sku?: boolean
    productName?: boolean
    quantity?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentItem"]>

  export type ShipmentItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    productId?: boolean
    sku?: boolean
    productName?: boolean
    quantity?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentItem"]>

  export type ShipmentItemSelectScalar = {
    id?: boolean
    shipmentId?: boolean
    productId?: boolean
    sku?: boolean
    productName?: boolean
    quantity?: boolean
  }

  export type ShipmentItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shipmentId" | "productId" | "sku" | "productName" | "quantity", ExtArgs["result"]["shipmentItem"]>
  export type ShipmentItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }
  export type ShipmentItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }
  export type ShipmentItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }

  export type $ShipmentItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShipmentItem"
    objects: {
      shipment: Prisma.$ShipmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      shipmentId: string
      productId: string
      sku: string | null
      productName: string | null
      quantity: number
    }, ExtArgs["result"]["shipmentItem"]>
    composites: {}
  }

  type ShipmentItemGetPayload<S extends boolean | null | undefined | ShipmentItemDefaultArgs> = $Result.GetResult<Prisma.$ShipmentItemPayload, S>

  type ShipmentItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShipmentItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShipmentItemCountAggregateInputType | true
    }

  export interface ShipmentItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShipmentItem'], meta: { name: 'ShipmentItem' } }
    /**
     * Find zero or one ShipmentItem that matches the filter.
     * @param {ShipmentItemFindUniqueArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShipmentItemFindUniqueArgs>(args: SelectSubset<T, ShipmentItemFindUniqueArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ShipmentItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShipmentItemFindUniqueOrThrowArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShipmentItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ShipmentItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemFindFirstArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShipmentItemFindFirstArgs>(args?: SelectSubset<T, ShipmentItemFindFirstArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemFindFirstOrThrowArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShipmentItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ShipmentItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ShipmentItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShipmentItems
     * const shipmentItems = await prisma.shipmentItem.findMany()
     * 
     * // Get first 10 ShipmentItems
     * const shipmentItems = await prisma.shipmentItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shipmentItemWithIdOnly = await prisma.shipmentItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShipmentItemFindManyArgs>(args?: SelectSubset<T, ShipmentItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ShipmentItem.
     * @param {ShipmentItemCreateArgs} args - Arguments to create a ShipmentItem.
     * @example
     * // Create one ShipmentItem
     * const ShipmentItem = await prisma.shipmentItem.create({
     *   data: {
     *     // ... data to create a ShipmentItem
     *   }
     * })
     * 
     */
    create<T extends ShipmentItemCreateArgs>(args: SelectSubset<T, ShipmentItemCreateArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ShipmentItems.
     * @param {ShipmentItemCreateManyArgs} args - Arguments to create many ShipmentItems.
     * @example
     * // Create many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShipmentItemCreateManyArgs>(args?: SelectSubset<T, ShipmentItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShipmentItems and returns the data saved in the database.
     * @param {ShipmentItemCreateManyAndReturnArgs} args - Arguments to create many ShipmentItems.
     * @example
     * // Create many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShipmentItems and only return the `id`
     * const shipmentItemWithIdOnly = await prisma.shipmentItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShipmentItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ShipmentItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ShipmentItem.
     * @param {ShipmentItemDeleteArgs} args - Arguments to delete one ShipmentItem.
     * @example
     * // Delete one ShipmentItem
     * const ShipmentItem = await prisma.shipmentItem.delete({
     *   where: {
     *     // ... filter to delete one ShipmentItem
     *   }
     * })
     * 
     */
    delete<T extends ShipmentItemDeleteArgs>(args: SelectSubset<T, ShipmentItemDeleteArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ShipmentItem.
     * @param {ShipmentItemUpdateArgs} args - Arguments to update one ShipmentItem.
     * @example
     * // Update one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShipmentItemUpdateArgs>(args: SelectSubset<T, ShipmentItemUpdateArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ShipmentItems.
     * @param {ShipmentItemDeleteManyArgs} args - Arguments to filter ShipmentItems to delete.
     * @example
     * // Delete a few ShipmentItems
     * const { count } = await prisma.shipmentItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShipmentItemDeleteManyArgs>(args?: SelectSubset<T, ShipmentItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShipmentItemUpdateManyArgs>(args: SelectSubset<T, ShipmentItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentItems and returns the data updated in the database.
     * @param {ShipmentItemUpdateManyAndReturnArgs} args - Arguments to update many ShipmentItems.
     * @example
     * // Update many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ShipmentItems and only return the `id`
     * const shipmentItemWithIdOnly = await prisma.shipmentItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShipmentItemUpdateManyAndReturnArgs>(args: SelectSubset<T, ShipmentItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ShipmentItem.
     * @param {ShipmentItemUpsertArgs} args - Arguments to update or create a ShipmentItem.
     * @example
     * // Update or create a ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.upsert({
     *   create: {
     *     // ... data to create a ShipmentItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShipmentItem we want to update
     *   }
     * })
     */
    upsert<T extends ShipmentItemUpsertArgs>(args: SelectSubset<T, ShipmentItemUpsertArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ShipmentItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemCountArgs} args - Arguments to filter ShipmentItems to count.
     * @example
     * // Count the number of ShipmentItems
     * const count = await prisma.shipmentItem.count({
     *   where: {
     *     // ... the filter for the ShipmentItems we want to count
     *   }
     * })
    **/
    count<T extends ShipmentItemCountArgs>(
      args?: Subset<T, ShipmentItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShipmentItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShipmentItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShipmentItemAggregateArgs>(args: Subset<T, ShipmentItemAggregateArgs>): Prisma.PrismaPromise<GetShipmentItemAggregateType<T>>

    /**
     * Group by ShipmentItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShipmentItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShipmentItemGroupByArgs['orderBy'] }
        : { orderBy?: ShipmentItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShipmentItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShipmentItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShipmentItem model
   */
  readonly fields: ShipmentItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShipmentItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShipmentItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shipment<T extends ShipmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShipmentDefaultArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShipmentItem model
   */
  interface ShipmentItemFieldRefs {
    readonly id: FieldRef<"ShipmentItem", 'String'>
    readonly shipmentId: FieldRef<"ShipmentItem", 'String'>
    readonly productId: FieldRef<"ShipmentItem", 'String'>
    readonly sku: FieldRef<"ShipmentItem", 'String'>
    readonly productName: FieldRef<"ShipmentItem", 'String'>
    readonly quantity: FieldRef<"ShipmentItem", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ShipmentItem findUnique
   */
  export type ShipmentItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem findUniqueOrThrow
   */
  export type ShipmentItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem findFirst
   */
  export type ShipmentItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentItems.
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentItems.
     */
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * ShipmentItem findFirstOrThrow
   */
  export type ShipmentItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentItems.
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentItems.
     */
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * ShipmentItem findMany
   */
  export type ShipmentItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItems to fetch.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShipmentItems.
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * ShipmentItem create
   */
  export type ShipmentItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * The data needed to create a ShipmentItem.
     */
    data: XOR<ShipmentItemCreateInput, ShipmentItemUncheckedCreateInput>
  }

  /**
   * ShipmentItem createMany
   */
  export type ShipmentItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShipmentItems.
     */
    data: ShipmentItemCreateManyInput | ShipmentItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShipmentItem createManyAndReturn
   */
  export type ShipmentItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * The data used to create many ShipmentItems.
     */
    data: ShipmentItemCreateManyInput | ShipmentItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentItem update
   */
  export type ShipmentItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * The data needed to update a ShipmentItem.
     */
    data: XOR<ShipmentItemUpdateInput, ShipmentItemUncheckedUpdateInput>
    /**
     * Choose, which ShipmentItem to update.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem updateMany
   */
  export type ShipmentItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShipmentItems.
     */
    data: XOR<ShipmentItemUpdateManyMutationInput, ShipmentItemUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentItems to update
     */
    where?: ShipmentItemWhereInput
    /**
     * Limit how many ShipmentItems to update.
     */
    limit?: number
  }

  /**
   * ShipmentItem updateManyAndReturn
   */
  export type ShipmentItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * The data used to update ShipmentItems.
     */
    data: XOR<ShipmentItemUpdateManyMutationInput, ShipmentItemUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentItems to update
     */
    where?: ShipmentItemWhereInput
    /**
     * Limit how many ShipmentItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentItem upsert
   */
  export type ShipmentItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * The filter to search for the ShipmentItem to update in case it exists.
     */
    where: ShipmentItemWhereUniqueInput
    /**
     * In case the ShipmentItem found by the `where` argument doesn't exist, create a new ShipmentItem with this data.
     */
    create: XOR<ShipmentItemCreateInput, ShipmentItemUncheckedCreateInput>
    /**
     * In case the ShipmentItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShipmentItemUpdateInput, ShipmentItemUncheckedUpdateInput>
  }

  /**
   * ShipmentItem delete
   */
  export type ShipmentItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter which ShipmentItem to delete.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem deleteMany
   */
  export type ShipmentItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentItems to delete
     */
    where?: ShipmentItemWhereInput
    /**
     * Limit how many ShipmentItems to delete.
     */
    limit?: number
  }

  /**
   * ShipmentItem without action
   */
  export type ShipmentItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
  }


  /**
   * Model ShippingRate
   */

  export type AggregateShippingRate = {
    _count: ShippingRateCountAggregateOutputType | null
    _avg: ShippingRateAvgAggregateOutputType | null
    _sum: ShippingRateSumAggregateOutputType | null
    _min: ShippingRateMinAggregateOutputType | null
    _max: ShippingRateMaxAggregateOutputType | null
  }

  export type ShippingRateAvgAggregateOutputType = {
    minWeight: number | null
    maxWeight: number | null
    basePrice: number | null
    pricePerKg: number | null
    estimatedDays: number | null
  }

  export type ShippingRateSumAggregateOutputType = {
    minWeight: number | null
    maxWeight: number | null
    basePrice: number | null
    pricePerKg: number | null
    estimatedDays: number | null
  }

  export type ShippingRateMinAggregateOutputType = {
    id: string | null
    carrier: string | null
    serviceLevel: string | null
    region: string | null
    minWeight: number | null
    maxWeight: number | null
    basePrice: number | null
    pricePerKg: number | null
    currency: string | null
    estimatedDays: number | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShippingRateMaxAggregateOutputType = {
    id: string | null
    carrier: string | null
    serviceLevel: string | null
    region: string | null
    minWeight: number | null
    maxWeight: number | null
    basePrice: number | null
    pricePerKg: number | null
    currency: string | null
    estimatedDays: number | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ShippingRateCountAggregateOutputType = {
    id: number
    carrier: number
    serviceLevel: number
    region: number
    minWeight: number
    maxWeight: number
    basePrice: number
    pricePerKg: number
    currency: number
    estimatedDays: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ShippingRateAvgAggregateInputType = {
    minWeight?: true
    maxWeight?: true
    basePrice?: true
    pricePerKg?: true
    estimatedDays?: true
  }

  export type ShippingRateSumAggregateInputType = {
    minWeight?: true
    maxWeight?: true
    basePrice?: true
    pricePerKg?: true
    estimatedDays?: true
  }

  export type ShippingRateMinAggregateInputType = {
    id?: true
    carrier?: true
    serviceLevel?: true
    region?: true
    minWeight?: true
    maxWeight?: true
    basePrice?: true
    pricePerKg?: true
    currency?: true
    estimatedDays?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShippingRateMaxAggregateInputType = {
    id?: true
    carrier?: true
    serviceLevel?: true
    region?: true
    minWeight?: true
    maxWeight?: true
    basePrice?: true
    pricePerKg?: true
    currency?: true
    estimatedDays?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ShippingRateCountAggregateInputType = {
    id?: true
    carrier?: true
    serviceLevel?: true
    region?: true
    minWeight?: true
    maxWeight?: true
    basePrice?: true
    pricePerKg?: true
    currency?: true
    estimatedDays?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ShippingRateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShippingRate to aggregate.
     */
    where?: ShippingRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingRates to fetch.
     */
    orderBy?: ShippingRateOrderByWithRelationInput | ShippingRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShippingRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShippingRates
    **/
    _count?: true | ShippingRateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShippingRateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShippingRateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShippingRateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShippingRateMaxAggregateInputType
  }

  export type GetShippingRateAggregateType<T extends ShippingRateAggregateArgs> = {
        [P in keyof T & keyof AggregateShippingRate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShippingRate[P]>
      : GetScalarType<T[P], AggregateShippingRate[P]>
  }




  export type ShippingRateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShippingRateWhereInput
    orderBy?: ShippingRateOrderByWithAggregationInput | ShippingRateOrderByWithAggregationInput[]
    by: ShippingRateScalarFieldEnum[] | ShippingRateScalarFieldEnum
    having?: ShippingRateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShippingRateCountAggregateInputType | true
    _avg?: ShippingRateAvgAggregateInputType
    _sum?: ShippingRateSumAggregateInputType
    _min?: ShippingRateMinAggregateInputType
    _max?: ShippingRateMaxAggregateInputType
  }

  export type ShippingRateGroupByOutputType = {
    id: string
    carrier: string
    serviceLevel: string
    region: string | null
    minWeight: number
    maxWeight: number
    basePrice: number
    pricePerKg: number
    currency: string
    estimatedDays: number | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: ShippingRateCountAggregateOutputType | null
    _avg: ShippingRateAvgAggregateOutputType | null
    _sum: ShippingRateSumAggregateOutputType | null
    _min: ShippingRateMinAggregateOutputType | null
    _max: ShippingRateMaxAggregateOutputType | null
  }

  type GetShippingRateGroupByPayload<T extends ShippingRateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShippingRateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShippingRateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShippingRateGroupByOutputType[P]>
            : GetScalarType<T[P], ShippingRateGroupByOutputType[P]>
        }
      >
    >


  export type ShippingRateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    carrier?: boolean
    serviceLevel?: boolean
    region?: boolean
    minWeight?: boolean
    maxWeight?: boolean
    basePrice?: boolean
    pricePerKg?: boolean
    currency?: boolean
    estimatedDays?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shippingRate"]>

  export type ShippingRateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    carrier?: boolean
    serviceLevel?: boolean
    region?: boolean
    minWeight?: boolean
    maxWeight?: boolean
    basePrice?: boolean
    pricePerKg?: boolean
    currency?: boolean
    estimatedDays?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shippingRate"]>

  export type ShippingRateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    carrier?: boolean
    serviceLevel?: boolean
    region?: boolean
    minWeight?: boolean
    maxWeight?: boolean
    basePrice?: boolean
    pricePerKg?: boolean
    currency?: boolean
    estimatedDays?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["shippingRate"]>

  export type ShippingRateSelectScalar = {
    id?: boolean
    carrier?: boolean
    serviceLevel?: boolean
    region?: boolean
    minWeight?: boolean
    maxWeight?: boolean
    basePrice?: boolean
    pricePerKg?: boolean
    currency?: boolean
    estimatedDays?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ShippingRateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "carrier" | "serviceLevel" | "region" | "minWeight" | "maxWeight" | "basePrice" | "pricePerKg" | "currency" | "estimatedDays" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["shippingRate"]>

  export type $ShippingRatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShippingRate"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      carrier: string
      serviceLevel: string
      region: string | null
      minWeight: number
      maxWeight: number
      basePrice: number
      pricePerKg: number
      currency: string
      estimatedDays: number | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["shippingRate"]>
    composites: {}
  }

  type ShippingRateGetPayload<S extends boolean | null | undefined | ShippingRateDefaultArgs> = $Result.GetResult<Prisma.$ShippingRatePayload, S>

  type ShippingRateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShippingRateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShippingRateCountAggregateInputType | true
    }

  export interface ShippingRateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShippingRate'], meta: { name: 'ShippingRate' } }
    /**
     * Find zero or one ShippingRate that matches the filter.
     * @param {ShippingRateFindUniqueArgs} args - Arguments to find a ShippingRate
     * @example
     * // Get one ShippingRate
     * const shippingRate = await prisma.shippingRate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShippingRateFindUniqueArgs>(args: SelectSubset<T, ShippingRateFindUniqueArgs<ExtArgs>>): Prisma__ShippingRateClient<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ShippingRate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShippingRateFindUniqueOrThrowArgs} args - Arguments to find a ShippingRate
     * @example
     * // Get one ShippingRate
     * const shippingRate = await prisma.shippingRate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShippingRateFindUniqueOrThrowArgs>(args: SelectSubset<T, ShippingRateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShippingRateClient<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShippingRate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingRateFindFirstArgs} args - Arguments to find a ShippingRate
     * @example
     * // Get one ShippingRate
     * const shippingRate = await prisma.shippingRate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShippingRateFindFirstArgs>(args?: SelectSubset<T, ShippingRateFindFirstArgs<ExtArgs>>): Prisma__ShippingRateClient<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShippingRate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingRateFindFirstOrThrowArgs} args - Arguments to find a ShippingRate
     * @example
     * // Get one ShippingRate
     * const shippingRate = await prisma.shippingRate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShippingRateFindFirstOrThrowArgs>(args?: SelectSubset<T, ShippingRateFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShippingRateClient<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ShippingRates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingRateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShippingRates
     * const shippingRates = await prisma.shippingRate.findMany()
     * 
     * // Get first 10 ShippingRates
     * const shippingRates = await prisma.shippingRate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shippingRateWithIdOnly = await prisma.shippingRate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShippingRateFindManyArgs>(args?: SelectSubset<T, ShippingRateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ShippingRate.
     * @param {ShippingRateCreateArgs} args - Arguments to create a ShippingRate.
     * @example
     * // Create one ShippingRate
     * const ShippingRate = await prisma.shippingRate.create({
     *   data: {
     *     // ... data to create a ShippingRate
     *   }
     * })
     * 
     */
    create<T extends ShippingRateCreateArgs>(args: SelectSubset<T, ShippingRateCreateArgs<ExtArgs>>): Prisma__ShippingRateClient<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ShippingRates.
     * @param {ShippingRateCreateManyArgs} args - Arguments to create many ShippingRates.
     * @example
     * // Create many ShippingRates
     * const shippingRate = await prisma.shippingRate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShippingRateCreateManyArgs>(args?: SelectSubset<T, ShippingRateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShippingRates and returns the data saved in the database.
     * @param {ShippingRateCreateManyAndReturnArgs} args - Arguments to create many ShippingRates.
     * @example
     * // Create many ShippingRates
     * const shippingRate = await prisma.shippingRate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShippingRates and only return the `id`
     * const shippingRateWithIdOnly = await prisma.shippingRate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShippingRateCreateManyAndReturnArgs>(args?: SelectSubset<T, ShippingRateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ShippingRate.
     * @param {ShippingRateDeleteArgs} args - Arguments to delete one ShippingRate.
     * @example
     * // Delete one ShippingRate
     * const ShippingRate = await prisma.shippingRate.delete({
     *   where: {
     *     // ... filter to delete one ShippingRate
     *   }
     * })
     * 
     */
    delete<T extends ShippingRateDeleteArgs>(args: SelectSubset<T, ShippingRateDeleteArgs<ExtArgs>>): Prisma__ShippingRateClient<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ShippingRate.
     * @param {ShippingRateUpdateArgs} args - Arguments to update one ShippingRate.
     * @example
     * // Update one ShippingRate
     * const shippingRate = await prisma.shippingRate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShippingRateUpdateArgs>(args: SelectSubset<T, ShippingRateUpdateArgs<ExtArgs>>): Prisma__ShippingRateClient<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ShippingRates.
     * @param {ShippingRateDeleteManyArgs} args - Arguments to filter ShippingRates to delete.
     * @example
     * // Delete a few ShippingRates
     * const { count } = await prisma.shippingRate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShippingRateDeleteManyArgs>(args?: SelectSubset<T, ShippingRateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShippingRates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingRateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShippingRates
     * const shippingRate = await prisma.shippingRate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShippingRateUpdateManyArgs>(args: SelectSubset<T, ShippingRateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShippingRates and returns the data updated in the database.
     * @param {ShippingRateUpdateManyAndReturnArgs} args - Arguments to update many ShippingRates.
     * @example
     * // Update many ShippingRates
     * const shippingRate = await prisma.shippingRate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ShippingRates and only return the `id`
     * const shippingRateWithIdOnly = await prisma.shippingRate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShippingRateUpdateManyAndReturnArgs>(args: SelectSubset<T, ShippingRateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ShippingRate.
     * @param {ShippingRateUpsertArgs} args - Arguments to update or create a ShippingRate.
     * @example
     * // Update or create a ShippingRate
     * const shippingRate = await prisma.shippingRate.upsert({
     *   create: {
     *     // ... data to create a ShippingRate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShippingRate we want to update
     *   }
     * })
     */
    upsert<T extends ShippingRateUpsertArgs>(args: SelectSubset<T, ShippingRateUpsertArgs<ExtArgs>>): Prisma__ShippingRateClient<$Result.GetResult<Prisma.$ShippingRatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ShippingRates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingRateCountArgs} args - Arguments to filter ShippingRates to count.
     * @example
     * // Count the number of ShippingRates
     * const count = await prisma.shippingRate.count({
     *   where: {
     *     // ... the filter for the ShippingRates we want to count
     *   }
     * })
    **/
    count<T extends ShippingRateCountArgs>(
      args?: Subset<T, ShippingRateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShippingRateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShippingRate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingRateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShippingRateAggregateArgs>(args: Subset<T, ShippingRateAggregateArgs>): Prisma.PrismaPromise<GetShippingRateAggregateType<T>>

    /**
     * Group by ShippingRate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShippingRateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShippingRateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShippingRateGroupByArgs['orderBy'] }
        : { orderBy?: ShippingRateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShippingRateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShippingRateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShippingRate model
   */
  readonly fields: ShippingRateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShippingRate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShippingRateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShippingRate model
   */
  interface ShippingRateFieldRefs {
    readonly id: FieldRef<"ShippingRate", 'String'>
    readonly carrier: FieldRef<"ShippingRate", 'String'>
    readonly serviceLevel: FieldRef<"ShippingRate", 'String'>
    readonly region: FieldRef<"ShippingRate", 'String'>
    readonly minWeight: FieldRef<"ShippingRate", 'Float'>
    readonly maxWeight: FieldRef<"ShippingRate", 'Float'>
    readonly basePrice: FieldRef<"ShippingRate", 'Float'>
    readonly pricePerKg: FieldRef<"ShippingRate", 'Float'>
    readonly currency: FieldRef<"ShippingRate", 'String'>
    readonly estimatedDays: FieldRef<"ShippingRate", 'Int'>
    readonly active: FieldRef<"ShippingRate", 'Boolean'>
    readonly createdAt: FieldRef<"ShippingRate", 'DateTime'>
    readonly updatedAt: FieldRef<"ShippingRate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ShippingRate findUnique
   */
  export type ShippingRateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * Filter, which ShippingRate to fetch.
     */
    where: ShippingRateWhereUniqueInput
  }

  /**
   * ShippingRate findUniqueOrThrow
   */
  export type ShippingRateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * Filter, which ShippingRate to fetch.
     */
    where: ShippingRateWhereUniqueInput
  }

  /**
   * ShippingRate findFirst
   */
  export type ShippingRateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * Filter, which ShippingRate to fetch.
     */
    where?: ShippingRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingRates to fetch.
     */
    orderBy?: ShippingRateOrderByWithRelationInput | ShippingRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShippingRates.
     */
    cursor?: ShippingRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShippingRates.
     */
    distinct?: ShippingRateScalarFieldEnum | ShippingRateScalarFieldEnum[]
  }

  /**
   * ShippingRate findFirstOrThrow
   */
  export type ShippingRateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * Filter, which ShippingRate to fetch.
     */
    where?: ShippingRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingRates to fetch.
     */
    orderBy?: ShippingRateOrderByWithRelationInput | ShippingRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShippingRates.
     */
    cursor?: ShippingRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingRates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShippingRates.
     */
    distinct?: ShippingRateScalarFieldEnum | ShippingRateScalarFieldEnum[]
  }

  /**
   * ShippingRate findMany
   */
  export type ShippingRateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * Filter, which ShippingRates to fetch.
     */
    where?: ShippingRateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShippingRates to fetch.
     */
    orderBy?: ShippingRateOrderByWithRelationInput | ShippingRateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShippingRates.
     */
    cursor?: ShippingRateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShippingRates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShippingRates.
     */
    skip?: number
    distinct?: ShippingRateScalarFieldEnum | ShippingRateScalarFieldEnum[]
  }

  /**
   * ShippingRate create
   */
  export type ShippingRateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * The data needed to create a ShippingRate.
     */
    data: XOR<ShippingRateCreateInput, ShippingRateUncheckedCreateInput>
  }

  /**
   * ShippingRate createMany
   */
  export type ShippingRateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShippingRates.
     */
    data: ShippingRateCreateManyInput | ShippingRateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShippingRate createManyAndReturn
   */
  export type ShippingRateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * The data used to create many ShippingRates.
     */
    data: ShippingRateCreateManyInput | ShippingRateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShippingRate update
   */
  export type ShippingRateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * The data needed to update a ShippingRate.
     */
    data: XOR<ShippingRateUpdateInput, ShippingRateUncheckedUpdateInput>
    /**
     * Choose, which ShippingRate to update.
     */
    where: ShippingRateWhereUniqueInput
  }

  /**
   * ShippingRate updateMany
   */
  export type ShippingRateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShippingRates.
     */
    data: XOR<ShippingRateUpdateManyMutationInput, ShippingRateUncheckedUpdateManyInput>
    /**
     * Filter which ShippingRates to update
     */
    where?: ShippingRateWhereInput
    /**
     * Limit how many ShippingRates to update.
     */
    limit?: number
  }

  /**
   * ShippingRate updateManyAndReturn
   */
  export type ShippingRateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * The data used to update ShippingRates.
     */
    data: XOR<ShippingRateUpdateManyMutationInput, ShippingRateUncheckedUpdateManyInput>
    /**
     * Filter which ShippingRates to update
     */
    where?: ShippingRateWhereInput
    /**
     * Limit how many ShippingRates to update.
     */
    limit?: number
  }

  /**
   * ShippingRate upsert
   */
  export type ShippingRateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * The filter to search for the ShippingRate to update in case it exists.
     */
    where: ShippingRateWhereUniqueInput
    /**
     * In case the ShippingRate found by the `where` argument doesn't exist, create a new ShippingRate with this data.
     */
    create: XOR<ShippingRateCreateInput, ShippingRateUncheckedCreateInput>
    /**
     * In case the ShippingRate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShippingRateUpdateInput, ShippingRateUncheckedUpdateInput>
  }

  /**
   * ShippingRate delete
   */
  export type ShippingRateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
    /**
     * Filter which ShippingRate to delete.
     */
    where: ShippingRateWhereUniqueInput
  }

  /**
   * ShippingRate deleteMany
   */
  export type ShippingRateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShippingRates to delete
     */
    where?: ShippingRateWhereInput
    /**
     * Limit how many ShippingRates to delete.
     */
    limit?: number
  }

  /**
   * ShippingRate without action
   */
  export type ShippingRateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShippingRate
     */
    select?: ShippingRateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShippingRate
     */
    omit?: ShippingRateOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ShipmentScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    userId: 'userId',
    carrier: 'carrier',
    trackingNumber: 'trackingNumber',
    trackingUrl: 'trackingUrl',
    serviceLevel: 'serviceLevel',
    status: 'status',
    estimatedDelivery: 'estimatedDelivery',
    shippedAt: 'shippedAt',
    deliveredAt: 'deliveredAt',
    shippingCost: 'shippingCost',
    weight: 'weight',
    currency: 'currency',
    originAddress: 'originAddress',
    destinationAddress: 'destinationAddress',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ShipmentScalarFieldEnum = (typeof ShipmentScalarFieldEnum)[keyof typeof ShipmentScalarFieldEnum]


  export const ShipmentEventScalarFieldEnum: {
    id: 'id',
    shipmentId: 'shipmentId',
    status: 'status',
    location: 'location',
    description: 'description',
    occurredAt: 'occurredAt'
  };

  export type ShipmentEventScalarFieldEnum = (typeof ShipmentEventScalarFieldEnum)[keyof typeof ShipmentEventScalarFieldEnum]


  export const ShipmentItemScalarFieldEnum: {
    id: 'id',
    shipmentId: 'shipmentId',
    productId: 'productId',
    sku: 'sku',
    productName: 'productName',
    quantity: 'quantity'
  };

  export type ShipmentItemScalarFieldEnum = (typeof ShipmentItemScalarFieldEnum)[keyof typeof ShipmentItemScalarFieldEnum]


  export const ShippingRateScalarFieldEnum: {
    id: 'id',
    carrier: 'carrier',
    serviceLevel: 'serviceLevel',
    region: 'region',
    minWeight: 'minWeight',
    maxWeight: 'maxWeight',
    basePrice: 'basePrice',
    pricePerKg: 'pricePerKg',
    currency: 'currency',
    estimatedDays: 'estimatedDays',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ShippingRateScalarFieldEnum = (typeof ShippingRateScalarFieldEnum)[keyof typeof ShippingRateScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'ShipmentStatus'
   */
  export type EnumShipmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShipmentStatus'>
    


  /**
   * Reference to a field of type 'ShipmentStatus[]'
   */
  export type ListEnumShipmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShipmentStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type ShipmentWhereInput = {
    AND?: ShipmentWhereInput | ShipmentWhereInput[]
    OR?: ShipmentWhereInput[]
    NOT?: ShipmentWhereInput | ShipmentWhereInput[]
    id?: StringFilter<"Shipment"> | string
    orderId?: StringFilter<"Shipment"> | string
    userId?: StringFilter<"Shipment"> | string
    carrier?: StringNullableFilter<"Shipment"> | string | null
    trackingNumber?: StringNullableFilter<"Shipment"> | string | null
    trackingUrl?: StringNullableFilter<"Shipment"> | string | null
    serviceLevel?: StringNullableFilter<"Shipment"> | string | null
    status?: EnumShipmentStatusFilter<"Shipment"> | $Enums.ShipmentStatus
    estimatedDelivery?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    shippedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    shippingCost?: FloatNullableFilter<"Shipment"> | number | null
    weight?: FloatNullableFilter<"Shipment"> | number | null
    currency?: StringFilter<"Shipment"> | string
    originAddress?: JsonNullableFilter<"Shipment">
    destinationAddress?: JsonFilter<"Shipment">
    notes?: StringNullableFilter<"Shipment"> | string | null
    createdAt?: DateTimeFilter<"Shipment"> | Date | string
    updatedAt?: DateTimeFilter<"Shipment"> | Date | string
    events?: ShipmentEventListRelationFilter
    items?: ShipmentItemListRelationFilter
  }

  export type ShipmentOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    carrier?: SortOrderInput | SortOrder
    trackingNumber?: SortOrderInput | SortOrder
    trackingUrl?: SortOrderInput | SortOrder
    serviceLevel?: SortOrderInput | SortOrder
    status?: SortOrder
    estimatedDelivery?: SortOrderInput | SortOrder
    shippedAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    shippingCost?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    currency?: SortOrder
    originAddress?: SortOrderInput | SortOrder
    destinationAddress?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    events?: ShipmentEventOrderByRelationAggregateInput
    items?: ShipmentItemOrderByRelationAggregateInput
  }

  export type ShipmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ShipmentWhereInput | ShipmentWhereInput[]
    OR?: ShipmentWhereInput[]
    NOT?: ShipmentWhereInput | ShipmentWhereInput[]
    orderId?: StringFilter<"Shipment"> | string
    userId?: StringFilter<"Shipment"> | string
    carrier?: StringNullableFilter<"Shipment"> | string | null
    trackingNumber?: StringNullableFilter<"Shipment"> | string | null
    trackingUrl?: StringNullableFilter<"Shipment"> | string | null
    serviceLevel?: StringNullableFilter<"Shipment"> | string | null
    status?: EnumShipmentStatusFilter<"Shipment"> | $Enums.ShipmentStatus
    estimatedDelivery?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    shippedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    deliveredAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    shippingCost?: FloatNullableFilter<"Shipment"> | number | null
    weight?: FloatNullableFilter<"Shipment"> | number | null
    currency?: StringFilter<"Shipment"> | string
    originAddress?: JsonNullableFilter<"Shipment">
    destinationAddress?: JsonFilter<"Shipment">
    notes?: StringNullableFilter<"Shipment"> | string | null
    createdAt?: DateTimeFilter<"Shipment"> | Date | string
    updatedAt?: DateTimeFilter<"Shipment"> | Date | string
    events?: ShipmentEventListRelationFilter
    items?: ShipmentItemListRelationFilter
  }, "id">

  export type ShipmentOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    carrier?: SortOrderInput | SortOrder
    trackingNumber?: SortOrderInput | SortOrder
    trackingUrl?: SortOrderInput | SortOrder
    serviceLevel?: SortOrderInput | SortOrder
    status?: SortOrder
    estimatedDelivery?: SortOrderInput | SortOrder
    shippedAt?: SortOrderInput | SortOrder
    deliveredAt?: SortOrderInput | SortOrder
    shippingCost?: SortOrderInput | SortOrder
    weight?: SortOrderInput | SortOrder
    currency?: SortOrder
    originAddress?: SortOrderInput | SortOrder
    destinationAddress?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ShipmentCountOrderByAggregateInput
    _avg?: ShipmentAvgOrderByAggregateInput
    _max?: ShipmentMaxOrderByAggregateInput
    _min?: ShipmentMinOrderByAggregateInput
    _sum?: ShipmentSumOrderByAggregateInput
  }

  export type ShipmentScalarWhereWithAggregatesInput = {
    AND?: ShipmentScalarWhereWithAggregatesInput | ShipmentScalarWhereWithAggregatesInput[]
    OR?: ShipmentScalarWhereWithAggregatesInput[]
    NOT?: ShipmentScalarWhereWithAggregatesInput | ShipmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Shipment"> | string
    orderId?: StringWithAggregatesFilter<"Shipment"> | string
    userId?: StringWithAggregatesFilter<"Shipment"> | string
    carrier?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    trackingNumber?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    trackingUrl?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    serviceLevel?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    status?: EnumShipmentStatusWithAggregatesFilter<"Shipment"> | $Enums.ShipmentStatus
    estimatedDelivery?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    shippedAt?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    deliveredAt?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    shippingCost?: FloatNullableWithAggregatesFilter<"Shipment"> | number | null
    weight?: FloatNullableWithAggregatesFilter<"Shipment"> | number | null
    currency?: StringWithAggregatesFilter<"Shipment"> | string
    originAddress?: JsonNullableWithAggregatesFilter<"Shipment">
    destinationAddress?: JsonWithAggregatesFilter<"Shipment">
    notes?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Shipment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Shipment"> | Date | string
  }

  export type ShipmentEventWhereInput = {
    AND?: ShipmentEventWhereInput | ShipmentEventWhereInput[]
    OR?: ShipmentEventWhereInput[]
    NOT?: ShipmentEventWhereInput | ShipmentEventWhereInput[]
    id?: StringFilter<"ShipmentEvent"> | string
    shipmentId?: StringFilter<"ShipmentEvent"> | string
    status?: EnumShipmentStatusFilter<"ShipmentEvent"> | $Enums.ShipmentStatus
    location?: StringNullableFilter<"ShipmentEvent"> | string | null
    description?: StringNullableFilter<"ShipmentEvent"> | string | null
    occurredAt?: DateTimeFilter<"ShipmentEvent"> | Date | string
    shipment?: XOR<ShipmentScalarRelationFilter, ShipmentWhereInput>
  }

  export type ShipmentEventOrderByWithRelationInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    occurredAt?: SortOrder
    shipment?: ShipmentOrderByWithRelationInput
  }

  export type ShipmentEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ShipmentEventWhereInput | ShipmentEventWhereInput[]
    OR?: ShipmentEventWhereInput[]
    NOT?: ShipmentEventWhereInput | ShipmentEventWhereInput[]
    shipmentId?: StringFilter<"ShipmentEvent"> | string
    status?: EnumShipmentStatusFilter<"ShipmentEvent"> | $Enums.ShipmentStatus
    location?: StringNullableFilter<"ShipmentEvent"> | string | null
    description?: StringNullableFilter<"ShipmentEvent"> | string | null
    occurredAt?: DateTimeFilter<"ShipmentEvent"> | Date | string
    shipment?: XOR<ShipmentScalarRelationFilter, ShipmentWhereInput>
  }, "id">

  export type ShipmentEventOrderByWithAggregationInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    occurredAt?: SortOrder
    _count?: ShipmentEventCountOrderByAggregateInput
    _max?: ShipmentEventMaxOrderByAggregateInput
    _min?: ShipmentEventMinOrderByAggregateInput
  }

  export type ShipmentEventScalarWhereWithAggregatesInput = {
    AND?: ShipmentEventScalarWhereWithAggregatesInput | ShipmentEventScalarWhereWithAggregatesInput[]
    OR?: ShipmentEventScalarWhereWithAggregatesInput[]
    NOT?: ShipmentEventScalarWhereWithAggregatesInput | ShipmentEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ShipmentEvent"> | string
    shipmentId?: StringWithAggregatesFilter<"ShipmentEvent"> | string
    status?: EnumShipmentStatusWithAggregatesFilter<"ShipmentEvent"> | $Enums.ShipmentStatus
    location?: StringNullableWithAggregatesFilter<"ShipmentEvent"> | string | null
    description?: StringNullableWithAggregatesFilter<"ShipmentEvent"> | string | null
    occurredAt?: DateTimeWithAggregatesFilter<"ShipmentEvent"> | Date | string
  }

  export type ShipmentItemWhereInput = {
    AND?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    OR?: ShipmentItemWhereInput[]
    NOT?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    id?: StringFilter<"ShipmentItem"> | string
    shipmentId?: StringFilter<"ShipmentItem"> | string
    productId?: StringFilter<"ShipmentItem"> | string
    sku?: StringNullableFilter<"ShipmentItem"> | string | null
    productName?: StringNullableFilter<"ShipmentItem"> | string | null
    quantity?: IntFilter<"ShipmentItem"> | number
    shipment?: XOR<ShipmentScalarRelationFilter, ShipmentWhereInput>
  }

  export type ShipmentItemOrderByWithRelationInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    productId?: SortOrder
    sku?: SortOrderInput | SortOrder
    productName?: SortOrderInput | SortOrder
    quantity?: SortOrder
    shipment?: ShipmentOrderByWithRelationInput
  }

  export type ShipmentItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    OR?: ShipmentItemWhereInput[]
    NOT?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    shipmentId?: StringFilter<"ShipmentItem"> | string
    productId?: StringFilter<"ShipmentItem"> | string
    sku?: StringNullableFilter<"ShipmentItem"> | string | null
    productName?: StringNullableFilter<"ShipmentItem"> | string | null
    quantity?: IntFilter<"ShipmentItem"> | number
    shipment?: XOR<ShipmentScalarRelationFilter, ShipmentWhereInput>
  }, "id">

  export type ShipmentItemOrderByWithAggregationInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    productId?: SortOrder
    sku?: SortOrderInput | SortOrder
    productName?: SortOrderInput | SortOrder
    quantity?: SortOrder
    _count?: ShipmentItemCountOrderByAggregateInput
    _avg?: ShipmentItemAvgOrderByAggregateInput
    _max?: ShipmentItemMaxOrderByAggregateInput
    _min?: ShipmentItemMinOrderByAggregateInput
    _sum?: ShipmentItemSumOrderByAggregateInput
  }

  export type ShipmentItemScalarWhereWithAggregatesInput = {
    AND?: ShipmentItemScalarWhereWithAggregatesInput | ShipmentItemScalarWhereWithAggregatesInput[]
    OR?: ShipmentItemScalarWhereWithAggregatesInput[]
    NOT?: ShipmentItemScalarWhereWithAggregatesInput | ShipmentItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ShipmentItem"> | string
    shipmentId?: StringWithAggregatesFilter<"ShipmentItem"> | string
    productId?: StringWithAggregatesFilter<"ShipmentItem"> | string
    sku?: StringNullableWithAggregatesFilter<"ShipmentItem"> | string | null
    productName?: StringNullableWithAggregatesFilter<"ShipmentItem"> | string | null
    quantity?: IntWithAggregatesFilter<"ShipmentItem"> | number
  }

  export type ShippingRateWhereInput = {
    AND?: ShippingRateWhereInput | ShippingRateWhereInput[]
    OR?: ShippingRateWhereInput[]
    NOT?: ShippingRateWhereInput | ShippingRateWhereInput[]
    id?: StringFilter<"ShippingRate"> | string
    carrier?: StringFilter<"ShippingRate"> | string
    serviceLevel?: StringFilter<"ShippingRate"> | string
    region?: StringNullableFilter<"ShippingRate"> | string | null
    minWeight?: FloatFilter<"ShippingRate"> | number
    maxWeight?: FloatFilter<"ShippingRate"> | number
    basePrice?: FloatFilter<"ShippingRate"> | number
    pricePerKg?: FloatFilter<"ShippingRate"> | number
    currency?: StringFilter<"ShippingRate"> | string
    estimatedDays?: IntNullableFilter<"ShippingRate"> | number | null
    active?: BoolFilter<"ShippingRate"> | boolean
    createdAt?: DateTimeFilter<"ShippingRate"> | Date | string
    updatedAt?: DateTimeFilter<"ShippingRate"> | Date | string
  }

  export type ShippingRateOrderByWithRelationInput = {
    id?: SortOrder
    carrier?: SortOrder
    serviceLevel?: SortOrder
    region?: SortOrderInput | SortOrder
    minWeight?: SortOrder
    maxWeight?: SortOrder
    basePrice?: SortOrder
    pricePerKg?: SortOrder
    currency?: SortOrder
    estimatedDays?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShippingRateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    carrier_serviceLevel_region?: ShippingRateCarrierServiceLevelRegionCompoundUniqueInput
    AND?: ShippingRateWhereInput | ShippingRateWhereInput[]
    OR?: ShippingRateWhereInput[]
    NOT?: ShippingRateWhereInput | ShippingRateWhereInput[]
    carrier?: StringFilter<"ShippingRate"> | string
    serviceLevel?: StringFilter<"ShippingRate"> | string
    region?: StringNullableFilter<"ShippingRate"> | string | null
    minWeight?: FloatFilter<"ShippingRate"> | number
    maxWeight?: FloatFilter<"ShippingRate"> | number
    basePrice?: FloatFilter<"ShippingRate"> | number
    pricePerKg?: FloatFilter<"ShippingRate"> | number
    currency?: StringFilter<"ShippingRate"> | string
    estimatedDays?: IntNullableFilter<"ShippingRate"> | number | null
    active?: BoolFilter<"ShippingRate"> | boolean
    createdAt?: DateTimeFilter<"ShippingRate"> | Date | string
    updatedAt?: DateTimeFilter<"ShippingRate"> | Date | string
  }, "id" | "carrier_serviceLevel_region">

  export type ShippingRateOrderByWithAggregationInput = {
    id?: SortOrder
    carrier?: SortOrder
    serviceLevel?: SortOrder
    region?: SortOrderInput | SortOrder
    minWeight?: SortOrder
    maxWeight?: SortOrder
    basePrice?: SortOrder
    pricePerKg?: SortOrder
    currency?: SortOrder
    estimatedDays?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ShippingRateCountOrderByAggregateInput
    _avg?: ShippingRateAvgOrderByAggregateInput
    _max?: ShippingRateMaxOrderByAggregateInput
    _min?: ShippingRateMinOrderByAggregateInput
    _sum?: ShippingRateSumOrderByAggregateInput
  }

  export type ShippingRateScalarWhereWithAggregatesInput = {
    AND?: ShippingRateScalarWhereWithAggregatesInput | ShippingRateScalarWhereWithAggregatesInput[]
    OR?: ShippingRateScalarWhereWithAggregatesInput[]
    NOT?: ShippingRateScalarWhereWithAggregatesInput | ShippingRateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ShippingRate"> | string
    carrier?: StringWithAggregatesFilter<"ShippingRate"> | string
    serviceLevel?: StringWithAggregatesFilter<"ShippingRate"> | string
    region?: StringNullableWithAggregatesFilter<"ShippingRate"> | string | null
    minWeight?: FloatWithAggregatesFilter<"ShippingRate"> | number
    maxWeight?: FloatWithAggregatesFilter<"ShippingRate"> | number
    basePrice?: FloatWithAggregatesFilter<"ShippingRate"> | number
    pricePerKg?: FloatWithAggregatesFilter<"ShippingRate"> | number
    currency?: StringWithAggregatesFilter<"ShippingRate"> | string
    estimatedDays?: IntNullableWithAggregatesFilter<"ShippingRate"> | number | null
    active?: BoolWithAggregatesFilter<"ShippingRate"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"ShippingRate"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ShippingRate"> | Date | string
  }

  export type ShipmentCreateInput = {
    id?: string
    orderId: string
    userId: string
    carrier?: string | null
    trackingNumber?: string | null
    trackingUrl?: string | null
    serviceLevel?: string | null
    status?: $Enums.ShipmentStatus
    estimatedDelivery?: Date | string | null
    shippedAt?: Date | string | null
    deliveredAt?: Date | string | null
    shippingCost?: number | null
    weight?: number | null
    currency?: string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: ShipmentEventCreateNestedManyWithoutShipmentInput
    items?: ShipmentItemCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateInput = {
    id?: string
    orderId: string
    userId: string
    carrier?: string | null
    trackingNumber?: string | null
    trackingUrl?: string | null
    serviceLevel?: string | null
    status?: $Enums.ShipmentStatus
    estimatedDelivery?: Date | string | null
    shippedAt?: Date | string | null
    deliveredAt?: Date | string | null
    shippingCost?: number | null
    weight?: number | null
    currency?: string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: ShipmentEventUncheckedCreateNestedManyWithoutShipmentInput
    items?: ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    serviceLevel?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: ShipmentEventUpdateManyWithoutShipmentNestedInput
    items?: ShipmentItemUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    serviceLevel?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: ShipmentEventUncheckedUpdateManyWithoutShipmentNestedInput
    items?: ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentCreateManyInput = {
    id?: string
    orderId: string
    userId: string
    carrier?: string | null
    trackingNumber?: string | null
    trackingUrl?: string | null
    serviceLevel?: string | null
    status?: $Enums.ShipmentStatus
    estimatedDelivery?: Date | string | null
    shippedAt?: Date | string | null
    deliveredAt?: Date | string | null
    shippingCost?: number | null
    weight?: number | null
    currency?: string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShipmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    serviceLevel?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    serviceLevel?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentEventCreateInput = {
    id?: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description?: string | null
    occurredAt?: Date | string
    shipment: ShipmentCreateNestedOneWithoutEventsInput
  }

  export type ShipmentEventUncheckedCreateInput = {
    id?: string
    shipmentId: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description?: string | null
    occurredAt?: Date | string
  }

  export type ShipmentEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
    shipment?: ShipmentUpdateOneRequiredWithoutEventsNestedInput
  }

  export type ShipmentEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipmentId?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentEventCreateManyInput = {
    id?: string
    shipmentId: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description?: string | null
    occurredAt?: Date | string
  }

  export type ShipmentEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipmentId?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemCreateInput = {
    id?: string
    productId: string
    sku?: string | null
    productName?: string | null
    quantity?: number
    shipment: ShipmentCreateNestedOneWithoutItemsInput
  }

  export type ShipmentItemUncheckedCreateInput = {
    id?: string
    shipmentId: string
    productId: string
    sku?: string | null
    productName?: string | null
    quantity?: number
  }

  export type ShipmentItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
    shipment?: ShipmentUpdateOneRequiredWithoutItemsNestedInput
  }

  export type ShipmentItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipmentId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentItemCreateManyInput = {
    id?: string
    shipmentId: string
    productId: string
    sku?: string | null
    productName?: string | null
    quantity?: number
  }

  export type ShipmentItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    shipmentId?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ShippingRateCreateInput = {
    id?: string
    carrier: string
    serviceLevel: string
    region?: string | null
    minWeight?: number
    maxWeight?: number
    basePrice: number
    pricePerKg?: number
    currency?: string
    estimatedDays?: number | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShippingRateUncheckedCreateInput = {
    id?: string
    carrier: string
    serviceLevel: string
    region?: string | null
    minWeight?: number
    maxWeight?: number
    basePrice: number
    pricePerKg?: number
    currency?: string
    estimatedDays?: number | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShippingRateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    carrier?: StringFieldUpdateOperationsInput | string
    serviceLevel?: StringFieldUpdateOperationsInput | string
    region?: NullableStringFieldUpdateOperationsInput | string | null
    minWeight?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    basePrice?: FloatFieldUpdateOperationsInput | number
    pricePerKg?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    estimatedDays?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingRateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    carrier?: StringFieldUpdateOperationsInput | string
    serviceLevel?: StringFieldUpdateOperationsInput | string
    region?: NullableStringFieldUpdateOperationsInput | string | null
    minWeight?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    basePrice?: FloatFieldUpdateOperationsInput | number
    pricePerKg?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    estimatedDays?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingRateCreateManyInput = {
    id?: string
    carrier: string
    serviceLevel: string
    region?: string | null
    minWeight?: number
    maxWeight?: number
    basePrice: number
    pricePerKg?: number
    currency?: string
    estimatedDays?: number | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShippingRateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    carrier?: StringFieldUpdateOperationsInput | string
    serviceLevel?: StringFieldUpdateOperationsInput | string
    region?: NullableStringFieldUpdateOperationsInput | string | null
    minWeight?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    basePrice?: FloatFieldUpdateOperationsInput | number
    pricePerKg?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    estimatedDays?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShippingRateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    carrier?: StringFieldUpdateOperationsInput | string
    serviceLevel?: StringFieldUpdateOperationsInput | string
    region?: NullableStringFieldUpdateOperationsInput | string | null
    minWeight?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    basePrice?: FloatFieldUpdateOperationsInput | number
    pricePerKg?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    estimatedDays?: NullableIntFieldUpdateOperationsInput | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumShipmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusFilter<$PrismaModel> | $Enums.ShipmentStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ShipmentEventListRelationFilter = {
    every?: ShipmentEventWhereInput
    some?: ShipmentEventWhereInput
    none?: ShipmentEventWhereInput
  }

  export type ShipmentItemListRelationFilter = {
    every?: ShipmentItemWhereInput
    some?: ShipmentItemWhereInput
    none?: ShipmentItemWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ShipmentEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShipmentItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShipmentCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    carrier?: SortOrder
    trackingNumber?: SortOrder
    trackingUrl?: SortOrder
    serviceLevel?: SortOrder
    status?: SortOrder
    estimatedDelivery?: SortOrder
    shippedAt?: SortOrder
    deliveredAt?: SortOrder
    shippingCost?: SortOrder
    weight?: SortOrder
    currency?: SortOrder
    originAddress?: SortOrder
    destinationAddress?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShipmentAvgOrderByAggregateInput = {
    shippingCost?: SortOrder
    weight?: SortOrder
  }

  export type ShipmentMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    carrier?: SortOrder
    trackingNumber?: SortOrder
    trackingUrl?: SortOrder
    serviceLevel?: SortOrder
    status?: SortOrder
    estimatedDelivery?: SortOrder
    shippedAt?: SortOrder
    deliveredAt?: SortOrder
    shippingCost?: SortOrder
    weight?: SortOrder
    currency?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShipmentMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    carrier?: SortOrder
    trackingNumber?: SortOrder
    trackingUrl?: SortOrder
    serviceLevel?: SortOrder
    status?: SortOrder
    estimatedDelivery?: SortOrder
    shippedAt?: SortOrder
    deliveredAt?: SortOrder
    shippingCost?: SortOrder
    weight?: SortOrder
    currency?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShipmentSumOrderByAggregateInput = {
    shippingCost?: SortOrder
    weight?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumShipmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ShipmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShipmentStatusFilter<$PrismaModel>
    _max?: NestedEnumShipmentStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ShipmentScalarRelationFilter = {
    is?: ShipmentWhereInput
    isNot?: ShipmentWhereInput
  }

  export type ShipmentEventCountOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    status?: SortOrder
    location?: SortOrder
    description?: SortOrder
    occurredAt?: SortOrder
  }

  export type ShipmentEventMaxOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    status?: SortOrder
    location?: SortOrder
    description?: SortOrder
    occurredAt?: SortOrder
  }

  export type ShipmentEventMinOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    status?: SortOrder
    location?: SortOrder
    description?: SortOrder
    occurredAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ShipmentItemCountOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    productId?: SortOrder
    sku?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
  }

  export type ShipmentItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type ShipmentItemMaxOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    productId?: SortOrder
    sku?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
  }

  export type ShipmentItemMinOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    productId?: SortOrder
    sku?: SortOrder
    productName?: SortOrder
    quantity?: SortOrder
  }

  export type ShipmentItemSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ShippingRateCarrierServiceLevelRegionCompoundUniqueInput = {
    carrier: string
    serviceLevel: string
    region: string
  }

  export type ShippingRateCountOrderByAggregateInput = {
    id?: SortOrder
    carrier?: SortOrder
    serviceLevel?: SortOrder
    region?: SortOrder
    minWeight?: SortOrder
    maxWeight?: SortOrder
    basePrice?: SortOrder
    pricePerKg?: SortOrder
    currency?: SortOrder
    estimatedDays?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShippingRateAvgOrderByAggregateInput = {
    minWeight?: SortOrder
    maxWeight?: SortOrder
    basePrice?: SortOrder
    pricePerKg?: SortOrder
    estimatedDays?: SortOrder
  }

  export type ShippingRateMaxOrderByAggregateInput = {
    id?: SortOrder
    carrier?: SortOrder
    serviceLevel?: SortOrder
    region?: SortOrder
    minWeight?: SortOrder
    maxWeight?: SortOrder
    basePrice?: SortOrder
    pricePerKg?: SortOrder
    currency?: SortOrder
    estimatedDays?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShippingRateMinOrderByAggregateInput = {
    id?: SortOrder
    carrier?: SortOrder
    serviceLevel?: SortOrder
    region?: SortOrder
    minWeight?: SortOrder
    maxWeight?: SortOrder
    basePrice?: SortOrder
    pricePerKg?: SortOrder
    currency?: SortOrder
    estimatedDays?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ShippingRateSumOrderByAggregateInput = {
    minWeight?: SortOrder
    maxWeight?: SortOrder
    basePrice?: SortOrder
    pricePerKg?: SortOrder
    estimatedDays?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ShipmentEventCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput> | ShipmentEventCreateWithoutShipmentInput[] | ShipmentEventUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentEventCreateOrConnectWithoutShipmentInput | ShipmentEventCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentEventCreateManyShipmentInputEnvelope
    connect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
  }

  export type ShipmentItemCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
  }

  export type ShipmentEventUncheckedCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput> | ShipmentEventCreateWithoutShipmentInput[] | ShipmentEventUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentEventCreateOrConnectWithoutShipmentInput | ShipmentEventCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentEventCreateManyShipmentInputEnvelope
    connect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
  }

  export type ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumShipmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.ShipmentStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ShipmentEventUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput> | ShipmentEventCreateWithoutShipmentInput[] | ShipmentEventUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentEventCreateOrConnectWithoutShipmentInput | ShipmentEventCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput | ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentEventCreateManyShipmentInputEnvelope
    set?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    disconnect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    delete?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    connect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    update?: ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput | ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentEventUpdateManyWithWhereWithoutShipmentInput | ShipmentEventUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentEventScalarWhereInput | ShipmentEventScalarWhereInput[]
  }

  export type ShipmentItemUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput | ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    set?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    disconnect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    delete?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    update?: ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput | ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentItemUpdateManyWithWhereWithoutShipmentInput | ShipmentItemUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
  }

  export type ShipmentEventUncheckedUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput> | ShipmentEventCreateWithoutShipmentInput[] | ShipmentEventUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentEventCreateOrConnectWithoutShipmentInput | ShipmentEventCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput | ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentEventCreateManyShipmentInputEnvelope
    set?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    disconnect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    delete?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    connect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    update?: ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput | ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentEventUpdateManyWithWhereWithoutShipmentInput | ShipmentEventUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentEventScalarWhereInput | ShipmentEventScalarWhereInput[]
  }

  export type ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput | ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    set?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    disconnect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    delete?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    update?: ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput | ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentItemUpdateManyWithWhereWithoutShipmentInput | ShipmentItemUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
  }

  export type ShipmentCreateNestedOneWithoutEventsInput = {
    create?: XOR<ShipmentCreateWithoutEventsInput, ShipmentUncheckedCreateWithoutEventsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutEventsInput
    connect?: ShipmentWhereUniqueInput
  }

  export type ShipmentUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<ShipmentCreateWithoutEventsInput, ShipmentUncheckedCreateWithoutEventsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutEventsInput
    upsert?: ShipmentUpsertWithoutEventsInput
    connect?: ShipmentWhereUniqueInput
    update?: XOR<XOR<ShipmentUpdateToOneWithWhereWithoutEventsInput, ShipmentUpdateWithoutEventsInput>, ShipmentUncheckedUpdateWithoutEventsInput>
  }

  export type ShipmentCreateNestedOneWithoutItemsInput = {
    create?: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutItemsInput
    connect?: ShipmentWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ShipmentUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutItemsInput
    upsert?: ShipmentUpsertWithoutItemsInput
    connect?: ShipmentWhereUniqueInput
    update?: XOR<XOR<ShipmentUpdateToOneWithWhereWithoutItemsInput, ShipmentUpdateWithoutItemsInput>, ShipmentUncheckedUpdateWithoutItemsInput>
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumShipmentStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusFilter<$PrismaModel> | $Enums.ShipmentStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumShipmentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ShipmentStatus | EnumShipmentStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ShipmentStatus[] | ListEnumShipmentStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumShipmentStatusWithAggregatesFilter<$PrismaModel> | $Enums.ShipmentStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumShipmentStatusFilter<$PrismaModel>
    _max?: NestedEnumShipmentStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ShipmentEventCreateWithoutShipmentInput = {
    id?: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description?: string | null
    occurredAt?: Date | string
  }

  export type ShipmentEventUncheckedCreateWithoutShipmentInput = {
    id?: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description?: string | null
    occurredAt?: Date | string
  }

  export type ShipmentEventCreateOrConnectWithoutShipmentInput = {
    where: ShipmentEventWhereUniqueInput
    create: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentEventCreateManyShipmentInputEnvelope = {
    data: ShipmentEventCreateManyShipmentInput | ShipmentEventCreateManyShipmentInput[]
    skipDuplicates?: boolean
  }

  export type ShipmentItemCreateWithoutShipmentInput = {
    id?: string
    productId: string
    sku?: string | null
    productName?: string | null
    quantity?: number
  }

  export type ShipmentItemUncheckedCreateWithoutShipmentInput = {
    id?: string
    productId: string
    sku?: string | null
    productName?: string | null
    quantity?: number
  }

  export type ShipmentItemCreateOrConnectWithoutShipmentInput = {
    where: ShipmentItemWhereUniqueInput
    create: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentItemCreateManyShipmentInputEnvelope = {
    data: ShipmentItemCreateManyShipmentInput | ShipmentItemCreateManyShipmentInput[]
    skipDuplicates?: boolean
  }

  export type ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentEventWhereUniqueInput
    update: XOR<ShipmentEventUpdateWithoutShipmentInput, ShipmentEventUncheckedUpdateWithoutShipmentInput>
    create: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentEventWhereUniqueInput
    data: XOR<ShipmentEventUpdateWithoutShipmentInput, ShipmentEventUncheckedUpdateWithoutShipmentInput>
  }

  export type ShipmentEventUpdateManyWithWhereWithoutShipmentInput = {
    where: ShipmentEventScalarWhereInput
    data: XOR<ShipmentEventUpdateManyMutationInput, ShipmentEventUncheckedUpdateManyWithoutShipmentInput>
  }

  export type ShipmentEventScalarWhereInput = {
    AND?: ShipmentEventScalarWhereInput | ShipmentEventScalarWhereInput[]
    OR?: ShipmentEventScalarWhereInput[]
    NOT?: ShipmentEventScalarWhereInput | ShipmentEventScalarWhereInput[]
    id?: StringFilter<"ShipmentEvent"> | string
    shipmentId?: StringFilter<"ShipmentEvent"> | string
    status?: EnumShipmentStatusFilter<"ShipmentEvent"> | $Enums.ShipmentStatus
    location?: StringNullableFilter<"ShipmentEvent"> | string | null
    description?: StringNullableFilter<"ShipmentEvent"> | string | null
    occurredAt?: DateTimeFilter<"ShipmentEvent"> | Date | string
  }

  export type ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentItemWhereUniqueInput
    update: XOR<ShipmentItemUpdateWithoutShipmentInput, ShipmentItemUncheckedUpdateWithoutShipmentInput>
    create: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentItemWhereUniqueInput
    data: XOR<ShipmentItemUpdateWithoutShipmentInput, ShipmentItemUncheckedUpdateWithoutShipmentInput>
  }

  export type ShipmentItemUpdateManyWithWhereWithoutShipmentInput = {
    where: ShipmentItemScalarWhereInput
    data: XOR<ShipmentItemUpdateManyMutationInput, ShipmentItemUncheckedUpdateManyWithoutShipmentInput>
  }

  export type ShipmentItemScalarWhereInput = {
    AND?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
    OR?: ShipmentItemScalarWhereInput[]
    NOT?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
    id?: StringFilter<"ShipmentItem"> | string
    shipmentId?: StringFilter<"ShipmentItem"> | string
    productId?: StringFilter<"ShipmentItem"> | string
    sku?: StringNullableFilter<"ShipmentItem"> | string | null
    productName?: StringNullableFilter<"ShipmentItem"> | string | null
    quantity?: IntFilter<"ShipmentItem"> | number
  }

  export type ShipmentCreateWithoutEventsInput = {
    id?: string
    orderId: string
    userId: string
    carrier?: string | null
    trackingNumber?: string | null
    trackingUrl?: string | null
    serviceLevel?: string | null
    status?: $Enums.ShipmentStatus
    estimatedDelivery?: Date | string | null
    shippedAt?: Date | string | null
    deliveredAt?: Date | string | null
    shippingCost?: number | null
    weight?: number | null
    currency?: string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ShipmentItemCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateWithoutEventsInput = {
    id?: string
    orderId: string
    userId: string
    carrier?: string | null
    trackingNumber?: string | null
    trackingUrl?: string | null
    serviceLevel?: string | null
    status?: $Enums.ShipmentStatus
    estimatedDelivery?: Date | string | null
    shippedAt?: Date | string | null
    deliveredAt?: Date | string | null
    shippingCost?: number | null
    weight?: number | null
    currency?: string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentCreateOrConnectWithoutEventsInput = {
    where: ShipmentWhereUniqueInput
    create: XOR<ShipmentCreateWithoutEventsInput, ShipmentUncheckedCreateWithoutEventsInput>
  }

  export type ShipmentUpsertWithoutEventsInput = {
    update: XOR<ShipmentUpdateWithoutEventsInput, ShipmentUncheckedUpdateWithoutEventsInput>
    create: XOR<ShipmentCreateWithoutEventsInput, ShipmentUncheckedCreateWithoutEventsInput>
    where?: ShipmentWhereInput
  }

  export type ShipmentUpdateToOneWithWhereWithoutEventsInput = {
    where?: ShipmentWhereInput
    data: XOR<ShipmentUpdateWithoutEventsInput, ShipmentUncheckedUpdateWithoutEventsInput>
  }

  export type ShipmentUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    serviceLevel?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ShipmentItemUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateWithoutEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    serviceLevel?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentCreateWithoutItemsInput = {
    id?: string
    orderId: string
    userId: string
    carrier?: string | null
    trackingNumber?: string | null
    trackingUrl?: string | null
    serviceLevel?: string | null
    status?: $Enums.ShipmentStatus
    estimatedDelivery?: Date | string | null
    shippedAt?: Date | string | null
    deliveredAt?: Date | string | null
    shippingCost?: number | null
    weight?: number | null
    currency?: string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: ShipmentEventCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateWithoutItemsInput = {
    id?: string
    orderId: string
    userId: string
    carrier?: string | null
    trackingNumber?: string | null
    trackingUrl?: string | null
    serviceLevel?: string | null
    status?: $Enums.ShipmentStatus
    estimatedDelivery?: Date | string | null
    shippedAt?: Date | string | null
    deliveredAt?: Date | string | null
    shippingCost?: number | null
    weight?: number | null
    currency?: string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress: JsonNullValueInput | InputJsonValue
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    events?: ShipmentEventUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentCreateOrConnectWithoutItemsInput = {
    where: ShipmentWhereUniqueInput
    create: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
  }

  export type ShipmentUpsertWithoutItemsInput = {
    update: XOR<ShipmentUpdateWithoutItemsInput, ShipmentUncheckedUpdateWithoutItemsInput>
    create: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
    where?: ShipmentWhereInput
  }

  export type ShipmentUpdateToOneWithWhereWithoutItemsInput = {
    where?: ShipmentWhereInput
    data: XOR<ShipmentUpdateWithoutItemsInput, ShipmentUncheckedUpdateWithoutItemsInput>
  }

  export type ShipmentUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    serviceLevel?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: ShipmentEventUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    carrier?: NullableStringFieldUpdateOperationsInput | string | null
    trackingNumber?: NullableStringFieldUpdateOperationsInput | string | null
    trackingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    serviceLevel?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    estimatedDelivery?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deliveredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippingCost?: NullableFloatFieldUpdateOperationsInput | number | null
    weight?: NullableFloatFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    originAddress?: NullableJsonNullValueInput | InputJsonValue
    destinationAddress?: JsonNullValueInput | InputJsonValue
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    events?: ShipmentEventUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentEventCreateManyShipmentInput = {
    id?: string
    status: $Enums.ShipmentStatus
    location?: string | null
    description?: string | null
    occurredAt?: Date | string
  }

  export type ShipmentItemCreateManyShipmentInput = {
    id?: string
    productId: string
    sku?: string | null
    productName?: string | null
    quantity?: number
  }

  export type ShipmentEventUpdateWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentEventUncheckedUpdateWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentEventUncheckedUpdateManyWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumShipmentStatusFieldUpdateOperationsInput | $Enums.ShipmentStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    occurredAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemUpdateWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentItemUncheckedUpdateWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentItemUncheckedUpdateManyWithoutShipmentInput = {
    id?: StringFieldUpdateOperationsInput | string
    productId?: StringFieldUpdateOperationsInput | string
    sku?: NullableStringFieldUpdateOperationsInput | string | null
    productName?: NullableStringFieldUpdateOperationsInput | string | null
    quantity?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}