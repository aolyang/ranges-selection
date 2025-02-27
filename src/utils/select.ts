import { normalize } from "./normalize"
import type { Range, RangeArray } from "../types"

export function select(
    ranges: RangeArray,
    input: number | number[] | { [key: number]: boolean }
): RangeArray {
    if (typeof input === "number") {
        return normalize([...ranges, [input, input]])
    }

    if (Array.isArray(input)) {
        const sorted = [...input].sort((a, b) => a - b)
        const newRanges: RangeArray = []
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
        .filter(([_, value]) => value)
        .map(([key]) => parseInt(key))
    return select(ranges, indices)
}
