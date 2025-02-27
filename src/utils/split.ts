import { normalize } from "./normalize"
import type { Range, RangeArray } from "../types"

export function split(ranges: RangeArray, splitRange: Range): RangeArray {
    const result: RangeArray = []

    ranges.forEach(([start, end]) => {
        if (end < splitRange[0] || start > splitRange[1]) {
            result.push([start, end])
        } else {
            if (start < splitRange[0]) {
                result.push([start, splitRange[0] - 1])
            }
            if (end > splitRange[1]) {
                result.push([splitRange[1] + 1, end])
            }
        }
    })

    return normalize(result)
}
