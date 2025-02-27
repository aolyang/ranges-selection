# ranges-selection

handling range selections in large scale data records such as virtual lists/grid tables.


## Basic Usage
```js
import { Ranges } from "ranges-selection"

const ranges = new Ranges([[0, 10], [11, 15]])  // [[0, 15]]

// Check inclusion
ranges.include(5)         // true
ranges.include(16)        // false
ranges.merge([15, 16])    // [[0, 16]]
ranges.split(8)           // [[0, 7], [9, 16]]
```


ranges can be used directly in backend data query with good performance
```sql
SELECT * FROM table
WHERE id BETWEEN 0 AND 10
   OR id BETWEEN 12 AND 15
   OR id BETWEEN 22 AND 25
   -- ...more
```

## Installation

```bash
npm install ranges-selection
# or
yarn add ranges-selection
# or
pnpm add ranges-selection
```

## Usage

### Merge Ranges
```js
const ranges = new Ranges([[1, 3], [7, 9]])

ranges.merge([[5, 6]])        // [[1, 3], [5, 9]]
ranges.merge([[2, 4]])        // [[1, 9]]
```

### Split Range
```js
const ranges = new Ranges([[0, 10], [12, 15]])
ranges.split([9, 13])  // [[0, 8], [10, 10], [12, 12], [14, 15]]
```

### Select number index or a set of number
```js
const ranges = new Ranges([[0, 10], [12, 15]])

// Single number
ranges.select(44)  // [[0, 10], [12, 15], [44, 44]]

// Array of numbers
ranges.select([44, 55, 56, 57])  // [[0, 10], [12, 15], [44, 44], [55, 57]]
```

### Select Object

```js
const ranges = new Ranges([[0, 10], [12, 15]])

// Object with boolean flags
ranges.select({
    44: true,   // add 44
    45: false,  // remove 45
    46: true    // add 46
})  // [[0, 10], [12, 15], [44, 44], [46, 46]]
```

### Unselect Operations
```js
const ranges = new Ranges([[0, 10], [12, 15]])

// Single number
ranges.unselect(14)  // [[0, 10], [12, 13], [15, 15]]

// Array of numbers
ranges.unselect([2, 6, 7])  // [[0, 1], [3, 5], [8, 10], [12, 13], [15, 15]]
```

### Utility Functions
```js
import { normalize, merge, split, select, unselect, include } from 'ranges-selection/utils'

const ranges = [[0, 10], [12, 15]]

// Normalize ranges
normalize([[1, 3], [2, 4]])  // [[1, 4]]

// Merge ranges
merge([[0, 10], [12, 15]], [[16, 20]])  // [[0, 10], [12, 20]]

// Split range
split([[0, 10], [12, 15]], [9, 13])  // [[0, 8], [14, 15]]

// Include check
include([[0, 10], [12, 15]], 5)  // true
include([[0, 10], [12, 15]], [8, 13])  // false, 11 is not included
```

## API Reference

### Class Methods

#### `ranges.constructor(ranges?: [number, number][])`
Creates a new range selection instance with optional initial ranges.

#### `ranges.value(): [number, number][]`
Returns current state of ranges.

#### `ranges.include(target: number | [number, number]): boolean`
Checks if a number or range is included in current ranges.

#### `ranges.merge(ranges: [number, number][]): [number, number][]`
Merges new ranges with existing ranges.

#### `ranges.split(range: [number, number]): [number, number][]`
Splits ranges by removing specified range.

#### `ranges.select(input: number | number[] | { [key: number]: boolean }): [number, number][]`
Adds new indices to ranges. When using object input:
- `true`: adds the number
- `false`: removes/splits at the number

#### `ranges.unselect(input: number | number[]): [number, number][]`
Removes indices from ranges.

### Utility Functions

#### `normalize(ranges: [number, number][]): [number, number][]`
Sorts and merges overlapping or adjacent ranges.

#### `merge(existing: [number, number][], newRanges: [number, number][]): [number, number][]`
Merges two sets of ranges.

#### `split(ranges: [number, number][], splitRange: [number, number]): [number, number][]`
Splits ranges at the specified range.

#### `select(ranges: [number, number][], input: number | number[] | { [key: number]: boolean }): [number, number][]`
Adds new indices to ranges.

#### `unselect(ranges: [number, number][], indices: number | number[]): [number, number][]`
Removes indices from ranges.

#### `include(ranges: [number, number][], target: number | [number, number]): boolean`
Checks if a number or range is included in ranges.
