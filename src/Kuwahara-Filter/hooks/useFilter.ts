import * as PIXI from 'pixi.js'
import { useCallback, useMemo } from 'react'
import { kuwahara } from '../shader'

interface Props {
  width: number
  height: number
}

export default function useFilter({ width, height }: Props) {
  const uniforms = useMemo(
    () => ({
      resolution: {
        type: 'v2',
        value: [width, height],
      },
    }),
    [width, height]
  )

  const KuwaharaFilter = useMemo(() => new PIXI.Filter('', kuwahara, uniforms), [uniforms])

  return {
    KuwaharaFilter,
  }
}
