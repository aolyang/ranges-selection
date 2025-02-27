type Range = [number, number]
type RangeArray = Range[]

export function normalize(ranges: RangeArray): RangeArray {
    if (ranges.length === 0) return []

    const sorted = ranges.sort((a, b) => a[0] - b[0])
    const result: RangeArray = [sorted[0]]

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i]
        const last = result[result.length - 1]

        if (current[0] <= last[1] + 1) {
            last[1] = Math.max(last[1], current[1])
        } else {
            result.push(current)
        }
    }

    return result
}
