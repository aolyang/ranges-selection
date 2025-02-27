import type { Range } from "../types"

export function normalize(ranges: Range[]): Range[] {
    if (ranges.length === 0) return []

    const sorted = ranges.sort((a, b) => a[0] - b[0])
    const result: Range[] = [sorted[0]]

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i]
        const last = result[result.length - 1]

        if (current[0] <= last[1] + 1) {
            last[1] = Math.max(last[1], current[1])
        } else {
            result.push(current)
        }
    }

    return result
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
        })

        it("should handle multiple overlapping ranges", () => {
            expect(normalize([[1, 3], [2, 4], [6, 8], [7, 9]])).toEqual([[1, 4], [6, 9]])
        })
    })
}
