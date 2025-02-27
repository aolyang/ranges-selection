import { normalize } from "./normalize"
import type { Range, RangeArray } from "../types"

export function merge(existing: RangeArray, newRanges: RangeArray): RangeArray {
    return normalize([...existing, ...newRanges])
}
