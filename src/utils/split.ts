import type { Range } from "../types"

import { normalize } from "./normalize"

export function split(ranges: Range[], splitRange: Range): Range[] {
    const result: Range[] = []

    ranges.forEach(([start, end]) => {
        if (end < splitRange[0] || start > splitRange[1]) {
            result.push([start, end])
        } else {
            if (start < splitRange[0]) {
                result.push([start, splitRange[0] - 1])
            }
            if (end > splitRange[1]) {
                result.push([splitRange[1] + 1, end])
            }
        }
    })

    return normalize(result)
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("split function", () => {
        it("should handle empty ranges", () => {
            expect(split([], [1, 3])).toEqual([])
        })

        it("should handle non-overlapping splits", () => {
            expect(split([[1, 3]], [5, 7])).toEqual([[1, 3]])
            expect(split([[5, 7]], [1, 3])).toEqual([[5, 7]])
        })

        it("should split single range", () => {
            expect(split([[1, 10]], [4, 6])).toEqual([[1, 3], [7, 10]])
            expect(split([[1, 10]], [1, 5])).toEqual([[6, 10]])
            expect(split([[1, 10]], [5, 10])).toEqual([[1, 4]])
        })

        it("should split multiple ranges", () => {
            expect(split([[1, 5], [7, 10]], [3, 8]))
                .toEqual([[1, 2], [9, 10]])
        })

        it("should handle edge cases", () => {
            expect(split([[1, 10]], [1, 10])).toEqual([])
            expect(split([[1, 10]], [0, 11])).toEqual([])
            expect(split([[1, 10]], [1, 1])).toEqual([[2, 10]])
            expect(split([[1, 10]], [10, 10])).toEqual([[1, 9]])
        })
    })
}