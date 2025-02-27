import type { Range } from "../types"

import { normalize } from "./normalize"

export function unselect(ranges: Range[], indices: number | number[]): Range[] {
    const sortedIndices = Array.isArray(indices)
        ? [...indices].sort((a, b) => a - b)
        : [indices]

    const result: Range[] = []

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
