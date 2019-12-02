# Tacto

A convenient functional sorting library for javascript. Tacto uses the native sorting implementation under the hood
but provides abstractions to make then more readable and reusable. Also, it will always return shallow copies rather than
mutating the input data.

## Simple sorts
```typescript
import { asc, desc } from 'tacto'
const data = [6, 7, 2]
asc(data) // => [2, 6, 7], Note: this is a new copy of the array
desc(["cat", "dog", "bird"]) // => ["dog", "cat", "bird"]
asc(["10", "101", "1001"]) // => ["10", "1001", "101"], String inputs means string evaluation
```

## Object and/or multi-dimension sorts
```typescript
import tacto, { sorters, asc, desc } from 'tacto'

type Person = {
  name: string,
  age: number
}

const data: Person = [
  {"name":"Joe","age":50},
  {"name":"Maria","age"31},
  {"name":"Maria","age"22}
]

// Uses currying to give you a reusable sort function
const sortPersons = tacto<Person>(
  sorters.desc(x => x.name), 
  sorters.asc(x => x.age)
)

sortPersons(data)
/*
[
  {"name":"Maria","age":22},
  {"name":"Maria","age"31},
  {"name":"Joe","age"50}
]
*/
```
