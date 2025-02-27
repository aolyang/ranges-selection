import type { Range } from "../types"

import { normalize } from "./normalize"

export function merge(existing: Range[], newRanges: Range[]): Range[] {
    return normalize([...existing, ...newRanges])
}
