import type { Range } from "../types"

export function normalize(ranges: Range[]): Range[] {
    if (ranges.length === 0) return []

    const sorted = ranges
        .map(range => [...range] as Range)
        .sort((prev, next) => prev[0] - next[0])

    return sorted.reduce((acc, current) => {
        const last = acc[acc.length - 1]

        if (current[0] <= last[1] + 1)
            last[1] = Math.max(last[1], current[1])
        else
            acc.push(current)

        return acc
    }, [sorted.shift()!])
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("normalize function", () => {
        it("should handle empty array", () => {
            expect(normalize([])).toEqual([])
        })

        it("should handle single range", () => {
            expect(normalize([[1, 3]])).toEqual([[1, 3]])
        })

        it("should sort ranges", () => {
            expect(normalize([[5, 7], [1, 3]])).toEqual([[1, 3], [5, 7]])
        })

        it("should merge overlapping ranges", () => {
            expect(normalize([[1, 3], [2, 4]])).toEqual([[1, 4]])
            expect(normalize([[1, 5], [2, 3]])).toEqual([[1, 5]])
        })

        it("should merge adjacent ranges", () => {
            expect(normalize([[1, 2], [3, 4]])).toEqual([[1, 4]])
            expect(normalize([[1, 3], [5, 6]])).toEqual([[1, 3], [5, 6]])
            expect(normalize([[1, 3], [4, 6], [7, 9]])).toEqual([[1, 9]])
        })

        it("should handle multiple overlapping and adjacent ranges", () => {
            expect(normalize([[1, 3], [2, 4], [6, 8], [9, 10]])).toEqual([[1, 4], [6, 10]])
        })
    })
}
