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

    describe("test `merge` functions", () => {
        const flatEmptySpecs: FlatSpec[] = [
            { exists: [], ranges: [], expected: [] },
            { exists: [1, 3], ranges: [], expected: [1, 3] },
            { exists: [], ranges: [1, 3], expected: [1, 3] }
        ]

        it.each(flatEmptySpecs)
        ("should handle empty specs, merge $exits with $ranges", ({
            exists, ranges, expected
        }) => {
            expect(merge(exists, ranges)).toEqual(expected)
        })
    })

    describe("test `mergeArrays` functions", () => {
        const tupleEmptySpecs: TupleSpec[] = [
            { exists: [], ranges: [], expected: [] },
            { exists: [[1, 3]], ranges: [], expected: [[1, 3]] },
            { exists: [], ranges: [[1, 3]], expected: [[1, 3]] }
        ]

        it.each(tupleEmptySpecs)
        ("should handle empty specs, merge $exits with $ranges", ({
            exists, ranges, expected
        }) => {
            expect(mergeArrays(exists, ranges)).toEqual(expected)
        })
    })
}
