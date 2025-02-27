import type { Range } from "../types"

import { normalize } from "./normalize"

export function unselect(ranges: Range[], indices: number | number[]): Range[] {
    const sortedIndices = Array.isArray(indices)
        ? [...indices].sort((a, b) => a - b)
        : [indices]

    const result: Range[] = []

    ranges.forEach(([start, end]) => {
        let currentStart = start

        for (const index of sortedIndices) {
            if (index >= currentStart && index <= end) {
                if (currentStart < index) {
                    result.push([currentStart, index - 1])
                }
                currentStart = index + 1
            }
        }

        if (currentStart <= end) {
            result.push([currentStart, end])
        }
    })

    return normalize(result)
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("unselect function", () => {
        const baseRanges: Range[] = [[0, 10], [12, 15]]

        it("should handle single index", () => {
            expect(unselect(baseRanges, 5)).toEqual([[0, 4], [6, 10], [12, 15]])
            expect(unselect(baseRanges, 0)).toEqual([[1, 10], [12, 15]])
            expect(unselect(baseRanges, 10)).toEqual([[0, 9], [12, 15]])
        })

        it("should handle array of indices", () => {
            expect(unselect(baseRanges, [2, 6, 7])).toEqual([[0, 1], [3, 5], [8, 10], [12, 15]])
            expect(unselect(baseRanges, [0, 10, 15])).toEqual([[1, 9], [12, 14]])
        })

        it("should handle consecutive indices", () => {
            expect(unselect(baseRanges, [5, 6, 7])).toEqual([[0, 4], [8, 10], [12, 15]])
        })

        it("should handle non-existing indices", () => {
            expect(unselect(baseRanges, [11])).toEqual([[0, 10], [12, 15]])
            expect(unselect(baseRanges, [16])).toEqual([[0, 10], [12, 15]])
        })

        it("should handle empty inputs", () => {
            expect(unselect([], 1)).toEqual([])
            expect(unselect([], [])).toEqual([])
        })
    })
}
