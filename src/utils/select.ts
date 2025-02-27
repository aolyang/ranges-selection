import type { Range } from "../types"

import { normalize } from "./normalize"

export function select(
    ranges: Range[],
    input: number | number[] | { [key: number]: boolean }
): Range[] {
    if (typeof input === "number") {
        return normalize([...ranges, [input, input]])
    }

    if (Array.isArray(input)) {
        if (input.length === 0) return normalize(ranges)

        const sorted = [...input].sort((a, b) => a - b)
        const newRanges: Range[] = []
        let current: Range = [sorted[0], sorted[0]]

        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] === current[1] + 1) {
                current[1] = sorted[i]
            } else {
                newRanges.push([...current])
                current = [sorted[i], sorted[i]]
            }
        }
        newRanges.push(current)

        return normalize([...ranges, ...newRanges])
    }

    const indices = Object.entries(input)
        .filter(([_, value]) => value !== undefined && value !== null && value)
        .map(([key]) => parseInt(key))

    return select(ranges, indices)
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("select function", () => {
        const baseRanges: Range[] = [[0, 10], [12, 15]]

        it("should handle empty inputs", () => {
            expect(select([], [])).toEqual([])
            expect(select([], {})).toEqual([])
            expect(select(baseRanges, [])).toEqual([[0, 10], [12, 15]])
            expect(select(baseRanges, {})).toEqual([[0, 10], [12, 15]])
        })

        it("should handle undefined/null values in object", () => {
            expect(select(baseRanges, { 44: undefined, 45: null, 46: true } as any))
                .toEqual([[0, 10], [12, 15], [46, 46]])
        })

        it("should handle single number input", () => {
            expect(select(baseRanges, 44)).toEqual([[0, 10], [12, 15], [44, 44]])
            expect(select(baseRanges, 11)).toEqual([[0, 15]])
        })

        it("should handle array input", () => {
            expect(select(baseRanges, [44, 45, 46])).toEqual([[0, 10], [12, 15], [44, 46]])
            expect(select(baseRanges, [11, 16, 17])).toEqual([[0, 17]])
        })

        it("should handle object input", () => {
            expect(select(baseRanges, { 44: true, 45: true, 46: true }))
                .toEqual([[0, 10], [12, 15], [44, 46]])
            expect(select(baseRanges, { 11: true, 16: true }))
                .toEqual([[0, 16]])
        })

        it("should handle empty inputs", () => {
            expect(select([], 1)).toEqual([[1, 1]])
            expect(select([], [])).toEqual([])
            expect(select([], {})).toEqual([])
        })
    })
}
