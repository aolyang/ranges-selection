type Range = [start: number, end: number]

/**
 * Merges arrays of range tuples
 * @param exists - Existing array of range tuples (e.g., [[1,3], [5,6]])
 * @param ranges - New array of range tuples to merge (e.g., [[5,7], [9,10]])
 * @returns Merged array of range tuples (e.g., [[1,3], [5,7], [9,10]])
 * @example
 * [[1, 3], [5, 6]] + [[5, 7], [9, 10]] = [[1, 3], [5, 7], [9, 10]]
 * */
function merge(exists: Range[], ranges: Range[]): Range[] {
    const _ranges = exists.concat(ranges).sort((a, b) => a[0] - b[0])

    const merged: Range[] = []

    let current: Range
    while (_ranges.length) {
        current = _ranges.shift() as Range

        if (current.length !== 2) return []
        if (merged.length) {
            const last = merged[merged.length - 1]
            if (current[0] <= last[1]) {
                last[1] = Math.max(last[1], current[1])
                continue
            } else if (current[0] === last[1] + 1) {
                last[1] = current[1]
                continue
            }
        }

        merged.push(current)
    }

    return merged
}

export {
    merge
}

if (import.meta.vitest) {
    type SpecKeys = "exists" | "ranges" | "expected"
    type TupleSpec = Record<SpecKeys, Range[]>

    const { describe, it, expect } = import.meta.vitest

    describe("`merge` functions", () => {
        let message: string
        let specs: TupleSpec[]

        const illegalRange = [1] as any
        message = "when items length not valid, return empty range []"
        specs = [
            { exists: [illegalRange], ranges: [], expected: [] },
            { exists: [], ranges: [illegalRange], expected: [] },
            { exists: [[1, 3], illegalRange], ranges: [], expected: [] },
            { exists: [], ranges: [[1, 3], illegalRange], expected: [] }
        ]
        it.each(specs)(message, ({ exists, ranges, expected }) => {
            expect(merge(exists, ranges)).toEqual(expected)
        })

        message = "should handle empty specs, merge $exists with $ranges"
        specs = [
            { exists: [], ranges: [], expected: [] },
            { exists: [[1, 3]], ranges: [], expected: [[1, 3]] },
            { exists: [], ranges: [[1, 3]], expected: [[1, 3]] }
        ]

        it.each(specs)(message, ({ exists, ranges, expected }) => {
            expect(merge(exists, ranges)).toEqual(expected)
        })
        message = "should merge ranges, merge $exists with $ranges"
        specs = [
            { exists: [[1, 3]], ranges: [[5, 7]], expected: [[1, 3], [5, 7]] },
            { exists: [[1, 3]], ranges: [[4, 7], [9, 10]], expected: [[1, 7], [9, 10]] },
            { exists: [[1, 3], [5, 7], [10, 14]], ranges: [[3, 5]], expected: [[1, 7], [10, 14]] },
            { exists: [[1, 3], [5, 7], [10, 14]], ranges: [[3, 5], [7, 10]], expected: [[1, 14]] }
        ]
        it.each(specs)(message, ({ exists, ranges, expected }) => {
            expect(merge(exists, ranges)).toEqual(expected)
        })
    })
}
