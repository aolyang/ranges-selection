import { normalize } from "./normalize"
import type { Range, RangeArray } from "../types"

export function unselect(ranges: RangeArray, indices: number | number[]): RangeArray {
    const sortedIndices = Array.isArray(indices)
        ? [...indices].sort((a, b) => a - b)
        : [indices]

    const result: RangeArray = []

    ranges.forEach(([start, end]) => {
        let currentStart = start

        for (const index of sortedIndices) {
            if (index >= currentStart && index <= end) {
                if (currentStart < index) {
                    result.push([currentStart, index - 1])
                }
                currentStart = index + 1
            }
        }

        if (currentStart <= end) {
            result.push([currentStart, end])
        }
    })

    return normalize(result)
}
