import * as PIXI from 'pixi.js'
import { useMemo } from 'react'
import { bilateral, kuwahara } from '../shader'

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
  const BilateralFilter = useMemo(() => new PIXI.Filter('', bilateral, uniforms), [uniforms])

  return {
    KuwaharaFilter,
    BilateralFilter,
  }
}
