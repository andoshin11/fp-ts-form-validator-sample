import * as E from 'fp-ts/lib/Either'
import * as NEA from "fp-ts/lib/NonEmptyArray";
import * as R from 'fp-ts/lib/Record'
import { pipe } from 'fp-ts/lib/pipeable';
import { array } from 'fp-ts/lib/Array'

type SingleError<T extends object = never> = { field: T extends never ? string : keyof T; error: string }

export type Validator<D extends Record<string, unknown>> = (data: D) => E.Either<SingleError<D>, D>

const applicativeValidation = E.getValidation(NEA.getSemigroup<SingleError>());

function lift<A>(
  check: (a: A) => E.Either<SingleError, A>
): (a: A) => E.Either<NEA.NonEmptyArray<SingleError>, A> {
  return a => pipe(
    check(a),
    E.mapLeft(a => [a])
  )
}

export function colletErrors(
  data: Record<string, unknown>,
  err: NEA.NonEmptyArray<SingleError>
): Record<string, string[]> {
  const emptyErrors = pipe(
    data,
    R.map(() => [] as string[])
  )
  return err.reduce((prev, current) => {
    return {
      ...prev,
      [current.field]: [...prev[current.field], current.error]
    }
  }, emptyErrors)
}

export function validateErrorMap<
  D extends Record<string, unknown>,
  E extends SingleError
>(
  rules: Array<(data: D) => E.Either<E, D>>
): (data: D) => E.Either<Record<string, string[]>, D> {
  return data => pipe(
    array.sequence(applicativeValidation)(
      rules.map(valid => lift(valid)(data))
    ),
    E.bimap(
      errs => colletErrors(data, errs),
      () => data
    )
  )
}
