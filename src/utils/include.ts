import type { Range } from "../types"

export function include(ranges: Range[], target: number | Range): boolean {
    if (typeof target === "number") {
        return ranges.some(([start, end]) => start <= target && target <= end)
    }

    const [targetStart, targetEnd] = target
    return ranges.some(([start, end]) => start <= targetStart && targetEnd <= end)
}

export function includes(ranges: Range[], numbers: number[]): { [key: number]: boolean } {
    if (ranges.length === 0 || numbers.length === 0) {
        return numbers.reduce((acc, num) => ({ ...acc, [num]: false }), {})
    }

    const sorted = [...numbers].sort((p, n) => p - n)
    const result: { [key: number]: boolean } = {}

    let rangeIndex = 0
    let numIndex = 0

    while (numIndex < sorted.length && ranges[rangeIndex]) {
        const num = sorted[numIndex]
        const [start, end] = ranges[rangeIndex]

        if (num < start) {
            result[num] = false
            numIndex++
        } else if (num >= start && num <= end) {
            result[num] = true
            numIndex++
        } else if (num > end) {
            rangeIndex++
        }
    }
    while (numIndex < sorted.length) {
        result[sorted[numIndex]] = false
        numIndex++
    }

    return sorted.reduce((acc, num) => ({ ...acc, [num]: result[num] }), {})
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("include function", () => {
        const baseRanges: Range[] = [[0, 10], [12, 15]]

        it("should check single number inclusion", () => {
            expect(include(baseRanges, 5)).toBe(true)
            expect(include(baseRanges, 11)).toBe(false)
            expect(include(baseRanges, 12)).toBe(true)
            expect(include(baseRanges, 16)).toBe(false)
        })

        it("should check range inclusion", () => {
            expect(include(baseRanges, [5, 8])).toBe(true)
            expect(include(baseRanges, [8, 13])).toBe(false) // 11 is not included
            expect(include(baseRanges, [11, 11])).toBe(false)
            expect(include(baseRanges, [12, 14])).toBe(true)
            expect(include(baseRanges, [15, 16])).toBe(false) // 16 is not included
            expect(include(baseRanges, [16, 20])).toBe(false)
        })

        it("should handle empty ranges", () => {
            expect(include([], 5)).toBe(false)
            expect(include([], [5, 10])).toBe(false)
        })
    })

    describe("includes function", () => {
        const baseRanges: Range[] = [[0, 10], [12, 15]]

        it("should check multiple numbers", () => {
            expect(includes(baseRanges, [5, 11, 12, 16])).toEqual({
                5: true,
                11: false,
                12: true,
                16: false
            })
        })

        it("should handle empty input", () => {
            expect(includes(baseRanges, [])).toEqual({})
        })

        it("should handle empty ranges", () => {
            expect(includes([], [1, 2, 3])).toEqual({
                1: false,
                2: false,
                3: false
            })
        })
    })
}
