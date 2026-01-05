import postcss from 'postcss'
import tailwindPostcss from '@tailwindcss/postcss'
import type { Config } from 'tailwindcss'
import { join } from 'node:path'
import type { ResolvedOptions } from '../../config'

function interopDefault(mod: any) {
  return mod.default || mod
}

export async function buildTailwindCssWithCandidates(
  inputCss: string,
  options: ResolvedOptions,
  candidates: readonly string[],
  config: Config,
): Promise<string> {
  const tailwindPlugin = interopDefault(tailwindPostcss)
  const processor = postcss([tailwindPlugin({ config, base: options.root } as any)])
  const result = await processor.process(inputCss, {
    from: join(options.root, '__styling__.css'),
  })
  return result.css
}
