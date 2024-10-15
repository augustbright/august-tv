export type ApiSchema = {
  [key: string]: ApiSchema | boolean | undefined;
  $?: ApiSchema | true;
};

type IsSchemaWith$<Schema extends ApiSchema> = Schema['$'] extends
  | true
  | ApiSchema
  ? true
  : false;

const SYMBOL_PATH_DESCRIPTION = Symbol('path descriptor');
type PathDescriptor = {
  [SYMBOL_PATH_DESCRIPTION]: {
    path: string;
  };
};

export type Api<Schema extends ApiSchema> = {
  [Key in keyof Omit<Schema, '$'>]: Schema[Key] extends true
    ? PathDescriptor
    : Api<Extract<Schema[Key], ApiSchema>>;
} & (IsSchemaWith$<Schema> extends true
  ? {
      $: (
        param: string | number
      ) => Schema['$'] extends true
        ? PathDescriptor
        : Api<Extract<Schema['$'], ApiSchema>>;
    }
  : unknown) &
  PathDescriptor;

export function buildApi<T extends ApiSchema>(schema: T): Api<T> {
  const build = (schema: ApiSchema, path: string) => {
    const handler = {
      get(target: unknown, prop: string | symbol) {
        console.log('prop', prop);
        if (prop === Symbol.toPrimitive) {
          return () => path;
        }

        if (prop === SYMBOL_PATH_DESCRIPTION) {
          return {
            path
          };
        }
        if (typeof prop === 'symbol') {
          throw new RangeError('Symbol properties are not supported');
        }

        const fullPath = path + '/' + prop;

        if (prop === '$') {
          return (param: string | number) => {
            if (typeof param !== 'string' && typeof param !== 'number') {
              throw new Error(
                `Invalid API route parameter on path ${fullPath} got value ${param}`
              );
            }

            if (param === '') {
              throw new Error(
                `Invalid API route parameter on path ${fullPath} got empty string`
              );
            }

            if (schema['$'] === true) {
              return {
                [SYMBOL_PATH_DESCRIPTION]: {
                  path: path + '/' + param
                },
                [Symbol.toPrimitive]: () => path + '/' + param
              };
            } else if (typeof schema['$'] === 'object') {
              return build(schema['$'], path + '/' + param);
            } else {
              throw new Error(
                `Invalid API schema structure on path ${fullPath} got value ${schema['$']}`
              );
            }
          };
        }

        if (schema[prop] === true) {
          return {
            [SYMBOL_PATH_DESCRIPTION]: {
              path: fullPath
            },
            [Symbol.toPrimitive]: () => fullPath
          };
        }

        if (typeof schema[prop] !== 'object') {
          throw new Error(
            `Invalid API schema structure on path ${fullPath} got value ${schema[prop]}`
          );
        }

        return build(schema[prop], fullPath);
      }
    };

    return new Proxy({}, handler);
  };

  return build(schema, '') as Api<T>;
}

export function makeApiProcessor<S extends ApiSchema, T>(
  api: Api<S>,
  pathFn: (path: string) => T
) {
  function apiProcessor(fn: (root: Api<S>) => PathDescriptor) {
    return pathFn(fn(api)[SYMBOL_PATH_DESCRIPTION].path);
  }

  return apiProcessor;
}
