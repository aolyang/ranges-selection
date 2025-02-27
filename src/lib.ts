import type { IndexObject, Range } from "./types"

import { include } from "./utils/include"
import { merge } from "./utils/merge"
import { normalize } from "./utils/normalize"
import { select } from "./utils/select"
import { split } from "./utils/split"
import { unselect } from "./utils/unselect"

export class Ranges {
    private ranges: Range[]

    /**
     * Creates a new Ranges instance with optional initial ranges
     * @param ranges - Array of number tuples representing initial ranges
     */
    constructor(ranges: Range[] = []) {
        this.ranges = normalize(ranges)
    }

    /**
     * Returns the current state of ranges
     * @returns Array of number tuples representing the current ranges
     */
    value(): Range[] {
        return this.ranges.concat([])
    }

    /**
     * Merges new ranges with existing ranges
     * @param ranges - Array of number tuples to merge with existing ranges
     * @returns Updated ranges after merging
     * @example
     * ranges.value() // [[0, 10], [12, 15]]
     * ranges.merge([[16, 20], [22, 24]]) // [[0, 10], [12, 20], [22, 24]]
     */
    merge(ranges: Range[]): Range[] {
        this.ranges = merge(this.ranges, ranges)
        return this.value()
    }

    /**
     * Splits ranges by removing a specified range
     * @param range - A number tuple representing the range to split at
     * @returns Updated ranges after splitting
     * @example
     * ranges.value() // [[0, 10], [12, 15]]
     * ranges.split([9, 13]) // [[0, 8], [14, 15]]
     */
    split(range: Range): Range[] {
        this.ranges = split(this.ranges, range)
        return this.value()
    }

    /**
     * Selects new indices to add to the ranges
     * @param input - Single index, array of indices, or object with index-boolean pairs
     * @returns Updated ranges after selection
     * @example
     * // Single index
     * ranges.select(44) // [[0, 10], [12, 15], [44, 44]]
     *
     * // Array of indices
     * ranges.select([44, 55, 56, 57]) // [[0, 10], [12, 15], [44, 44], [55, 57]]
     *
     * // Object with index-boolean pairs
     * ranges.select({ 44: true, 55: true }) // [[0, 10], [12, 15], [44, 44], [55, 55]]
     */
    select(input: number | number[] | IndexObject): Range[] {
        this.ranges = select(this.ranges, input)
        return this.value()
    }

    /**
     * Unselects indices from the ranges
     * @param input - Single index or array of indices to remove from ranges
     * @returns Updated ranges after un-selection
     * @example
     * // Single index
     * ranges.value() // [[0, 10], [12, 15]]
     * ranges.unselect(14) // [[0, 10], [12, 13], [15, 15]]
     *
     * // Array of indices
     * ranges.unselect([2, 6, 7]) // [[0, 1], [3, 5], [8, 10], [12, 15]]
     */
    unselect(input: number | number[]): Range[] {
        this.ranges = unselect(this.ranges, input)
        return this.value()
    }

    /**
     * Checks if a number or range is included in the current ranges
     * @param target - Number or range to check for inclusion
     * @returns True if the target is included in any range
     * @example
     * ranges.value() // [[0, 10], [12, 15]]
     * ranges.include(5) // true
     * ranges.include(11) // false
     * ranges.include([8, 13]) // true
     */
    include(target: number | Range): boolean {
        return include(this.ranges, target)
    }
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("Ranges class", () => {
        it("should initialize with empty or initial ranges", () => {
            const empty = new Ranges()
            expect(empty.value()).toEqual([])

            // [0-10] and [12-15] should not merge as 12 !== 10 + 1
            const initial = new Ranges([[0, 10], [12, 15]])
            expect(initial.value()).toEqual([[0, 10], [12, 15]])
        })

        it("should merge ranges", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            // [15,16] should merge with [16,20]
            expect(ranges.merge([[15, 16], [16, 20], [22, 24]]))
                .toEqual([[0, 10], [12, 20], [22, 24]])
        })

        it("should split ranges", () => {
            const ranges = new Ranges([[0, 10], [11, 15]]) // 11 is adjacent to 10
            expect(ranges.split([9, 13]))
                .toEqual([[0, 8], [14, 15]])
        })

        it("should select single index", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            // 11 should merge [0,10] and [12,15] as 11 is adjacent to both
            expect(ranges.select(11))
                .toEqual([[0, 15]])
        })

        it("should select array of indices", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            // [55,56,57] should merge as they are adjacent
            // 44 and 59 should be separate as they're not adjacent to anything
            expect(ranges.select([44, 55, 56, 57, 59]))
                .toEqual([[0, 10], [12, 15], [44, 44], [55, 57], [59, 59]])
        })

        it("should select using object", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            // Same as array test: adjacent numbers should merge
            expect(ranges.select({ 44: true, 55: true, 56: true, 57: true, 59: true }))
                .toEqual([[0, 10], [12, 15], [44, 44], [55, 57], [59, 59]])
        })

        it("should unselect single index", () => {
            const ranges = new Ranges([[0, 10], [11, 15]]) // 11 is adjacent to 10
            expect(ranges.unselect(11))
                .toEqual([[0, 10], [12, 15]])
        })

        it("should unselect array of indices", () => {
            const ranges = new Ranges([[0, 10], [11, 15]]) // 11 is adjacent to 10
            expect(ranges.unselect([2, 3, 4, 11]))
                .toEqual([[0, 1], [5, 10], [12, 15]])
        })

        it("should check inclusion", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])

            // Check numbers
            expect(ranges.include(5)).toBe(true)
            expect(ranges.include(11)).toBe(false)

            // Check ranges
            expect(ranges.include([5, 8])).toBe(true)
            expect(ranges.include([8, 13])).toBe(false) // 11 is not included
            expect(ranges.include([16, 20])).toBe(false)
        })
    })
}
