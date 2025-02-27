import type { Range } from "../types"

import { normalize } from "./normalize"

export function split(ranges: Range[], splitRange: Range): Range[] {
    const result: Range[] = []

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
