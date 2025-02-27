import type { Range } from "../types"

import { collect } from "./collect"
import { normalize } from "./normalize"
import { split } from "./split"

export function select(
    ranges: Range[],
    input: number | number[] | { [key: number]: boolean }
): Range[] {
    if (typeof input === "number") {
        return normalize([...ranges, [input, input]])
    }

    if (Array.isArray(input)) {
        if (input.length === 0) return normalize([...ranges])
        return normalize([...ranges, ...collect(input)])
    }

    let result = [...ranges]
    // do not trust user input
    const entries: [key: string, value: boolean | undefined | null][] = Object.entries(input)
        .filter(([_, value]) => value !== undefined && value !== null)

    // Handle false values first (split)
    const splitIndices = entries
        .filter(([_, value]) => value === false)
        .map(([key]) => parseInt(key))

    for (const range of collect(splitIndices)) {
        result = split(result, range)
    }

    // Then handle true values (select)
    const selectIndices = entries
        .filter(([_, value]) => value === true)
        .map(([key]) => parseInt(key))

    return normalize([...result, ...collect(selectIndices)])
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
            expect(select(baseRanges, { 44: true, 45: true, 46: true })).toEqual([[0, 10], [12, 15], [44, 46]])
            expect(select(baseRanges, { 11: true, 16: true })).toEqual([[0, 16]])
        })

        it("should handle empty inputs", () => {
            expect(select([], 1)).toEqual([[1, 1]])
            expect(select([], [])).toEqual([])
            expect(select([], {})).toEqual([])
        })

        it("should handle boolean values in object", () => {
            expect(select(baseRanges, {
                44: true,
                45: false,
                46: true
            })).toEqual([[0, 10], [12, 15], [44, 44], [46, 46]])

            expect(select([[0, 10]], {
                5: false,
                7: true
            })).toEqual([[0, 4], [6, 10]])

            expect(select([[1, 10]], {
                3: false,
                4: false,
                5: false
            })).toEqual([[1, 2], [6, 10]])
        })
    })
}

