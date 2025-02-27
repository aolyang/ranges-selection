import type { Range } from "../types"

export function include(ranges: Range[], target: number | Range): boolean {
    if (typeof target === "number") {
        return ranges.some(([start, end]) => start <= target && target <= end)
    }

    const [targetStart, targetEnd] = target
    return ranges.some(([start, end]) => start <= targetStart && targetEnd <= end)
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
}
