import type { Range } from "../types"

import { normalize } from "./normalize"

export function merge(existing: Range[], newRanges: Range[]): Range[] {
    return normalize([...existing, ...newRanges])
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("merge function", () => {
        it("should handle empty arrays", () => {
            expect(merge([], [])).toEqual([])
            expect(merge([[1, 3]], [])).toEqual([[1, 3]])
            expect(merge([], [[1, 3]])).toEqual([[1, 3]])
        })

        it("should merge non-overlapping ranges", () => {
            expect(merge([[1, 3]], [[5, 7]])).toEqual([[1, 3], [5, 7]])
            expect(merge([[1, 3], [7, 9]], [[5, 6]])).toEqual([[1, 3], [5, 6], [7, 9]])
        })

        it("should merge overlapping ranges", () => {
            expect(merge([[1, 3]], [[2, 4]])).toEqual([[1, 4]])
            expect(merge([[1, 3], [7, 9]], [[2, 8]])).toEqual([[1, 9]])
        })

        it("should merge adjacent ranges", () => {
            expect(merge([[1, 3]], [[4, 6]])).toEqual([[1, 6]])
            expect(merge([[1, 3], [7, 9]], [[4, 6]])).toEqual([[1, 6], [7, 9]])
        })
    })
}
