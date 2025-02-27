# range-selection

a range selection helper for infinite virtual List/Grid table

benefits for SQL query:
```sql
SELECT * from LargeTabel
WHERE id 
    BETWEEN 0 AND 10
    OR id BETWEEN 12 AND 15
    OR id BETWEEN 22 AND 25
    -- ...more
```

## usage

```js
import { Ranges } from "range-selection"

const ranges = new Ranges([[0, 10], [12, 15]])
ranges.value() // [[0, 10], [12, 15]]
```

### **merge** two ranges
```js
const ranges = [[16, 20], [22, 24]]
ranges.value() // [[0, 10], [12, 15]]
ranges.merge(ranges) // [[0, 10], [12, 20], [22, 24]]
```

### **split** ranges by provide a unselect index range

```js
const range = [22, 33]
ranges.value() // [[0, 10], [12, 15]]
ranges.split([9, 13]) // [[0, 8], [14, 15]]
```

### **select** a single index

convert index to a range

```js
const index = 44
ranges.value() // [[0, 10], [12, 15]]
ranges.select(index) // [[0, 10], [12, 15], [44, 44]]
```

### **select** an array of index

optimize continuous values

```js
const indexArray = [44, 55,56,57, 66,67,68]
ranges.value() // [[0, 10], [12, 15]]
ranges.select(indexArray) // [[0, 10], [12, 15], [44, 44], [55, 57], [66, 68]]
```

### **select** an object of index

```js
const indexObject = {
    44: true,
    55: true, 56: true, 57: true,
    66: true, 67: true, 68: true
}
ranges.value() // [[0, 10], [12, 15]]
ranges.select(indexObject) // [[0, 10], [12, 15], [44, 44], [55, 57], [66, 68]]
```

### **unselect** a single index

```js
const index = 14
ranges.value() // [[0, 10], [12, 15]]
ranges.unselect(index) // [[0, 10], [12, 13], [15, 15]]
```

### **unselect** an array of index

```js
const indexArray = [2, 6, 7, 15]
ranges.value() // [[0, 10], [12, 15]]
ranges.unselect(indexArray) // [[1, 1], [3, 5], [8, 10], [12, 14]]
```

### **unselect** an object of index, using exist **select** api

```js
const indexObject = {
    2: false,
    6: false,
    7: false,
    11: true,
    15: false
}
ranges.value() // [[0, 10], [12, 15]]
ranges.select(indexObject) // [[1, 1], [3, 5], [8, 10], [11, 14]]
```