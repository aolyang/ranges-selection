import type { IndexObject,Range } from "./types"

import { merge } from "./utils/merge"
import { normalize } from "./utils/normalize"
import { select } from "./utils/select"
import { split } from "./utils/split"
import { unselect } from "./utils/unselect"

export class Ranges {
    private ranges:Range[]

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
}

if (import.meta.vitest) {
    const { describe, it, expect } = import.meta.vitest

    describe("Ranges class", () => {
        it("should initialize with empty or initial ranges", () => {
            const empty = new Ranges()
            expect(empty.value()).toEqual([])

            const initial = new Ranges([[0, 10], [12, 15]])
            expect(initial.value()).toEqual([[0, 10], [12, 15]])
        })

        it("should merge ranges", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            expect(ranges.merge([[16, 20], [22, 24]]))
                .toEqual([[0, 10], [12, 15], [16, 20], [22, 24]])
        })

        it("should split ranges", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            expect(ranges.split([9, 13]))
                .toEqual([[0, 8], [14, 15]])
        })

        it("should select single index", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            expect(ranges.select(44))
                .toEqual([[0, 10], [12, 15], [44, 44]])
        })

        it("should select array of indices", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            expect(ranges.select([44, 55, 56, 57]))
                .toEqual([[0, 10], [12, 15], [44, 44], [55, 57]])
        })

        it("should select using object", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            expect(ranges.select({ 44: true, 55: true, 56: true, 57: true }))
                .toEqual([[0, 10], [12, 15], [44, 44], [55, 57]])
        })

        it("should unselect single index", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            expect(ranges.unselect(14))
                .toEqual([[0, 10], [12, 13], [15, 15]])
        })

        it("should unselect array of indices", () => {
            const ranges = new Ranges([[0, 10], [12, 15]])
            expect(ranges.unselect([2, 6, 7]))
                .toEqual([[0, 1], [3, 5], [8, 10], [12, 15]])
        })
    })
}
