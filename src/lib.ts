type Range = [start: number, end: number]

/**
 * Merges ranges stored in flat array format
 * @param exists - Existing ranges in flat array format (e.g., [1,3,5,6])
 * @param ranges - New ranges to merge in flat array format (e.g., [5,7,9,10])
 * @returns Merged ranges in flat array format (e.g., [1,3,5,7,9,10])
 * @example
 * [1, 3, 5, 6] + [5, 7, 9, 10] = [1, 3, 5, 7, 9, 10]
 * [1, 3, 5, 7, 9, 10] (in meaning) equal to [[1, 3], [5, 7], [9, 10]]
 * */
function merge(exists: number[], ranges: number[]): number[] {

    return exists
}

/**
 * Merges arrays of range tuples
 * @param exists - Existing array of range tuples (e.g., [[1,3], [5,6]])
 * @param ranges - New array of range tuples to merge (e.g., [[5,7], [9,10]])
 * @returns Merged array of range tuples (e.g., [[1,3], [5,7], [9,10]])
 * @example
 * [[1, 3], [5, 6]] + [[5, 7], [9, 10]] = [[1, 3], [5, 7], [9, 10]]
 * */
function mergeArrays(exists: Range[], ranges: Range[]): Range[] {

    return exists
}

export {
    merge,
    mergeArrays
}

if (import.meta.vitest) {
    type SpecKeys = "exists" | "ranges" | "expected"
    type FlatSpec = Record<SpecKeys, number[]>
    type TupleSpec = Record<SpecKeys, Range[]>

    const { describe, it, expect } = import.meta.vitest

    describe("`merge` functions", () => {
        let message: string
        let specs: FlatSpec[]

        message = "should handle empty specs, merge $exists with $ranges, get $expected"
        specs = [
            { exists: [], ranges: [], expected: [] },
            { exists: [1, 3], ranges: [], expected: [1, 3] },
            { exists: [], ranges: [1, 3], expected: [1, 3] }
        ]

        it.each(specs)(message, ({ exists, ranges, expected }) => {
            expect(merge(exists, ranges)).toEqual(expected)
        })

        message = "should merge ranges, merge $exists with $ranges, get $expected"
        specs = [
            { exists: [1, 3], ranges: [5, 7], expected: [1, 3, 5, 7] },
            { exists: [1, 3], ranges: [4, 7, 9, 10], expected: [1, 7, 9, 10] },
            { exists: [1, 3, 5, 7, 10, 14], ranges: [3, 5], expected: [1, 7, 10, 14] },
            { exists: [1, 3, 5, 7, 10, 14], ranges: [3, 5, 7, 10], expected: [1, 14] }
        ]
        it.each(specs)(message, ({ exists, ranges, expected }) => {
            expect(merge(exists, ranges)).toEqual(expected)
        })
    })

    describe("`mergeArrays` functions", () => {
        let message: string
        let specs: TupleSpec[]

        message = "should handle empty specs, merge $exists with $ranges, get $expected"
        specs = [
            { exists: [], ranges: [], expected: [] },
            { exists: [[1, 3]], ranges: [], expected: [[1, 3]] },
            { exists: [], ranges: [[1, 3]], expected: [[1, 3]] }
        ]

        it.each(specs)(message, ({ exists, ranges, expected }) => {
            expect(mergeArrays(exists, ranges)).toEqual(expected)
        })
        message = "should merge ranges, merge $exists with $ranges, get $expected"
        specs = [
            { exists: [[1, 3]], ranges: [[5, 7]], expected: [[1, 3], [5, 7]] },
            { exists: [[1, 3]], ranges: [[4, 7], [9, 10]], expected: [[1, 7], [9, 10]] },
            { exists: [[1, 3], [5, 7], [10, 14]], ranges: [[3, 5]], expected: [[1, 7], [10, 14]] },
            { exists: [[1, 3], [5, 7], [10, 14]], ranges: [[3, 5], [7, 10]], expected: [[1, 7], [10, 14]] }
        ]
        it.each(specs)(message, ({ exists, ranges, expected }) => {
            expect(mergeArrays(exists, ranges)).toEqual(expected)
        })
    })
}
