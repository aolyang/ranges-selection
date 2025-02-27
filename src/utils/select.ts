import type { Range } from "../types"

import { normalize } from "./normalize"

export function select(
    ranges: Range[],
    input: number | number[] | { [key: number]: boolean }
): Range[] {
    if (typeof input === "number") {
        return normalize([...ranges, [input, input]])
    }

    if (Array.isArray(input)) {
        const sorted = [...input].sort((a, b) => a - b)
        const newRanges: Range[] = []
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
