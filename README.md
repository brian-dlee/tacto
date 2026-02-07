# Tacto

[![CI](https://github.com/brian-dlee/tacto/actions/workflows/ci.yml/badge.svg)](https://github.com/brian-dlee/tacto/actions/workflows/ci.yml)
[![npm](https://badge.fury.io/js/tacto.svg)](https://www.npmjs.com/package/tacto)

A convenient functional sorting library written in TypeScript. Tacto uses the native sorting implementation under the hood but provides abstractions to make sorts more readable and reusable. It always returns shallow copies rather than mutating the input data.

- Zero dependencies
- Dual ESM/CJS with full TypeScript types
- Composable multi-key sorting

## Install

```shell
npm install tacto
```

## Basic sorting

```typescript
import { asc, desc } from 'tacto'

asc([6, 7, 2])
// => [2, 6, 7]

desc(["cat", "dog", "bird"])
// => ["dog", "cat", "bird"]

asc(["10", "101", "1001"])
// String values use lexicographical ordering
// => ["10", "1001", "101"]
```

## Evaluators

An evaluator extracts a comparable value from each element. Tacto natively handles numbers, strings, and Dates.

```typescript
import tacto, { sorters } from 'tacto'

const sortNumerically = tacto<string>(
  sorters.asc(x => parseInt(x, 10))
)

sortNumerically(["101", "10", "1001"])
// => ["10", "101", "1001"]
```

## Multi-key sorting

Pass multiple sorters to `tacto()` to sort by multiple keys. Earlier sorters take priority — later ones act as tiebreakers.

```typescript
import tacto from 'tacto'

type Person = {
  name: string
  age: number
}

const data: Person[] = [
  { name: "Joe", age: 50 },
  { name: "Maria", age: 31 },
  { name: "Maria", age: 22 },
]

const sortPersons = tacto<Person>(
  tacto.sorters.desc(x => x.name),
  tacto.sorters.asc(x => x.age),
)

sortPersons(data)
// [
//   { name: "Maria", age: 22 },
//   { name: "Maria", age: 31 },
//   { name: "Joe", age: 50 },
// ]
```

## Custom comparators

Use the `raw` sorter when you need full control over comparison logic.

```typescript
import tacto, { sorters } from 'tacto'
import { compareSomeThings } from './util'

const data: SomeThing[] = [...]
const sorted = tacto<SomeThing>(
  sorters.raw((a, b) => compareSomeThings(a, b)),
)(data)
```

## API

### `tacto<T>(...sorters: Sorter<T>[]): (items: T[]) => T[]`

Creates a reusable sorting function. Accepts one or more sorters that are applied in order.

### `sorters.asc<T>(fn: (x: T) => number | string | Date): Sorter<T>`

Sort ascending by the value returned from `fn`.

### `sorters.desc<T>(fn: (x: T) => number | string | Date): Sorter<T>`

Sort descending by the value returned from `fn`.

### `sorters.raw<T>(fn: (a: T, b: T) => number): Sorter<T>`

Use a custom comparison function (same contract as `Array.prototype.sort`).

### `asc(items: Array<number | string | Date>): Array<number | string | Date>`

Convenience function — sort primitives ascending.

### `desc(items: Array<number | string | Date>): Array<number | string | Date>`

Convenience function — sort primitives descending.

## Development

```shell
pnpm install
pnpm --filter tacto build    # build the library
pnpm --filter tacto test     # run tests
pnpm --filter tacto lint     # check with biome
pnpm --filter tacto format   # auto-fix with biome
```

## License

[MIT](LICENSE)
