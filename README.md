# Tacto

![Tests](https://github.com/github/docs/actions/workflows/test.yml/badge.svg)
![Latest Release](https://badge.fury.io/js/tacto.svg)
![Codecov](https://img.shields.io/codecov/c/github/brian-dlee/tacto?logo=codecov)

## Getting started

```shell
npm install --save tacto
```

A convenient functional sorting library for javascript. Tacto uses the native sorting implementation under the hood
but provides abstractions to make then more readable and reusable. Also, it will always return shallow copies rather than
mutating the input data.

## Basic sorting

```typescript
import { asc, desc } from 'tacto'

asc([6, 7, 2]) 
// Tacto always returns a new copy of the input
// => [2, 6, 7]

desc(["cat", "dog", "bird"]) 
// => ["dog", "cat", "bird"]

asc(["10", "101", "1001"]) 
// String values mean lexicographical ordering
// => ["10", "1001", "101"]
```

## Evaluators

Let's revisit the previous example where we have numbers as strings, but want to sort them numerically.

```typescript
import tacto, { sorters } from 'tacto'

// Normally, the evaluator would be written inline
// It's extracted here for clarity
const evaluateString = x => parseInt(x, 10)

const sortNumerically = tacto<number>(
  sorters.asc(evaluateString)
)

sortNumerically(["101", "10", "1001"])
// => ["10", "101", "1001"]
```

## Object and multi-dimension sorting

```typescript
import tacto from 'tacto'

type Person = {
  name: string,
  age: number
}

const data: Person = [
  {"name": "Joe", "age": 50},
  {"name": "Maria", "age": 31},
  {"name": "Maria", "age": 22}
]

// Uses currying to give you a reusable sort function
const sortPersons = tacto<Person>(
  tacto.sorters.desc(x => x.name), 
  tacto.sorters.asc(x => x.age)
)

sortPersons(data)
// [
//   {"name": "Maria", "age": 22},
//   {"name": "Maria", "age": 31},
//   {"name": "Joe", "age": 50}
// ]
```

## Customized sorting

Maybe you have strange sort logic or you just have a function available that already has the sort logic implemented and requires both arguments as input. In this case, simply use the `raw` sorter.

```typescript
import tacto, { sorters } from 'tacto'
import compareSomeThings from './util'

const data: SomeThing = [...]
const sorted = tacto<SomeThing>(
  sorters.raw((a, b) => compareSomeThings(a, b)),
)(data)
```
