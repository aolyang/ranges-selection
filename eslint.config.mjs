import { combine, ignores } from "@aolyang/eslint-config"
import typescript from "@aolyang/eslint-config/typescript"
import stylistic  from "@aolyang/eslint-config/stylistic"

export default combine(
    typescript(),
    stylistic(),
    { ignores }
)
