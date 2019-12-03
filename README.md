# Tacto

![Travis (.org)](https://img.shields.io/travis/brian-dlee/tacto?logo=travis)
![Codecov](https://img.shields.io/codecov/c/github/brian-dlee/tacto?logo=codecov)

A convenient functional sorting library for javascript. Tacto uses the native sorting implementation under the hood
but provides abstractions to make then more readable and reusable. Also, it will always return shallow copies rather than
mutating the input data.

## Simple sorts

```typescript
import { asc, desc } from 'tacto'
const data = [6, 7, 2]
asc(data) 
// Tacto always returns a new copy of the input
// => [2, 6, 7]
desc(["cat", "dog", "bird"]) 
// => ["dog", "cat", "bird"]
asc(["10", "101", "1001"]) 
// String values mean lexicographical ordering
// => ["10", "1001", "101"]
```

## Object and multi-dimension sorts

```typescript
import tacto, { sorters } from 'tacto'

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
  sorters.desc(x => x.name), 
  sorters.asc(x => x.age)
)

sortPersons(data)
// [
//   {"name": "Maria", "age": 22},
//   {"name": "Maria", "age": 31},
//   {"name": "Joe", "age": 50}
// ]
```

## Custom sorters

Maybe you have strange sort logic or you just have a function available that already has the sort logic implemented and requires both arguments as input. In this case, simply use the `raw` sorter.

```typescript
import tacto, { sorters } from 'tacto'
import compareSomeThings from './util'

const data: SomeThing = [...]
const sorted = tacto<SomeThing>(
  sorters.raw((a, b) => compareSomeThings(a, b)),
)(data)
```
