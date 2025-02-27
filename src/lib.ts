import type { Range, RangeArray, IndexObject } from "./types"
import { normalize } from "./utils/normalize"
import { merge } from "./utils/merge"
import { split } from "./utils/split"
import { select } from "./utils/select"
import { unselect } from "./utils/unselect"

export class Ranges {
    private ranges: RangeArray

    constructor(initialRanges: RangeArray = []) {
        this.ranges = normalize(initialRanges)
    }

    value(): RangeArray {
        return [...this.ranges]
    }

    merge(ranges: RangeArray): RangeArray {
        this.ranges = merge(this.ranges, ranges)
        return this.value()
    }

    split(range: Range): RangeArray {
        this.ranges = split(this.ranges, range)
        return this.value()
    }

    select(input: number | number[] | IndexObject): RangeArray {
        this.ranges = select(this.ranges, input)
        return this.value()
    }

    unselect(input: number | number[]): RangeArray {
        this.ranges = unselect(this.ranges, input)
        return this.value()
    }
}
