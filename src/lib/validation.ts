import * as E from "fp-ts/lib/Either";
import * as NEA from "fp-ts/lib/NonEmptyArray";
import * as R from "fp-ts/lib/Record";
import { pipe } from "fp-ts/lib/pipeable";
import { array } from "fp-ts/lib/Array";

/**
 * Types
 */
type SingleError<T extends object = never> = {
  field: T extends never ? string : keyof T;
  error: string;
};

export type FormData = Record<string, unknown>;

export type FormErrors<D extends FormData> = { [key in keyof D]: string[] };

export type Validator<D extends FormData> = (
  data: D
) => E.Either<SingleError<D>, D>;

const applicativeValidation = E.getValidation(NEA.getSemigroup<SingleError>());

function lift<A>(
  check: (a: A) => E.Either<SingleError, A>
): (a: A) => E.Either<NEA.NonEmptyArray<SingleError>, A> {
  return a =>
    pipe(
      check(a),
      E.mapLeft(a => [a])
    );
}

export function colletErrors(
  data: FormData,
  err: NEA.NonEmptyArray<SingleError>
): Record<string, string[]> {
  const emptyErrors = pipe(
    data,
    R.map(() => [] as string[])
  );
  return err.reduce((prev, current) => {
    return {
      ...prev,
      [current.field]: [...prev[current.field], current.error]
    };
  }, emptyErrors);
}

export function validateErrorMap<D extends FormData, E extends SingleError>(
  rules: Array<(data: D) => E.Either<E, D>>
): (data: D) => E.Either<Record<string, string[]>, D> {
  return data =>
    pipe(
      array.sequence(applicativeValidation)(
        rules.map(valid => lift(valid)(data))
      ),
      E.bimap(
        errs => colletErrors(data, errs),
        () => data
      )
    );
}
