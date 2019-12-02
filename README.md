# Tacto

Sort things
```javascript
import tacto, { sorters } from 'tacto'
const data = [
  {"name":"Joe","age":50},
  {"name":"Maria","age"31},
  {"name":"Maria","age"22}
]
const sort = tacto([sorters.desc(x => x.name), sorters.asc(x => x.age)])
const sorted = sort(data) # returns shallow copy
/*
[
  {"name":"Maria","age":22},
  {"name":"Maria","age"31},
  {"name":"Joe","age"50}
]
*/
```
