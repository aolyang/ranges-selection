import type { Range } from "../types"

export function collect(numbers: number[]): Range[] {
    if (numbers.length === 0) return []

    const sorted = [...numbers].sort((a, b) => a - b)
    const result: Range[] = []
    let current: Range = [sorted[0], sorted[0]]

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] === current[1] + 1) {
            current[1] = sorted[i]
        } else if (sorted[i] !== current[1]) {
            result.push([...current])
            current = [sorted[i], sorted[i]]
        }
    }
    result.push(current)

    return result
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("collect function", () => {
        it("should handle empty input", () => {
            expect(collect([])).toEqual([])
        })

        it("should handle single number", () => {
            expect(collect([1])).toEqual([[1, 1]])
        })

        it("should merge adjacent numbers", () => {
            expect(collect([1, 2, 3])).toEqual([[1, 3]])
            expect(collect([1, 3, 2])).toEqual([[1, 3]])
        })

        it("should create separate ranges for non-adjacent numbers", () => {
            expect(collect([1, 3, 5])).toEqual([[1, 1], [3, 3], [5, 5]])
        })

        it("should handle mixed adjacent and non-adjacent numbers", () => {
            expect(collect([1, 2, 4, 6, 7, 8, 10])).toEqual([[1, 2], [4, 4], [6, 8], [10, 10]])
        })

        it("should handle duplicate numbers", () => {
            expect(collect([1, 2, 2, 3, 3, 4])).toEqual([[1, 4]])
        })
    })
}
