import { Sprite, Stage } from '@inlet/react-pixi'
import 'canvas-toBlob'
import { saveAs } from 'file-saver'
import React, { ChangeEvent, SyntheticEvent, useCallback, useMemo, useRef, useState } from 'react'
import { convertBlobToBase64, getAspectRatioOfBase64 } from '../utils'
import useFilter from './hooks/useFilter'
import { Container, DownloadSection, FilterSection, FiltersSection, InputSection } from './styled'

const initialCanvasSize = { width: 500, height: 500 }

export default function Filter() {
  const [canvasSize, setCanvasSize] = useState(initialCanvasSize)
  const [base64, setBase64] = useState<string | null>(null)
  const [pile, setPile] = useState<number>(1)
  const { KuwaharaFilter, BilateralFilter } = useFilter({ ...canvasSize })
  const stagetEl = useRef<any>(null)

  const handleFiles = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.prototype.slice.call(event.target.files)
    try {
      setBase64(null)
      setCanvasSize(initialCanvasSize)
      const _base64 = await convertBlobToBase64(files[0])
      setBase64(_base64)
      const aspectRatio = await getAspectRatioOfBase64(_base64)
      setCanvasSize(prev => ({ ...prev, width: prev.width * aspectRatio }))
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const handleDownload = useCallback((event: SyntheticEvent<HTMLButtonElement>) => {
    const stageElement = stagetEl.current
    if (!stageElement) {
      alert('Download failed')
      return
    }
    const app = stageElement.app
    const canvas = app.renderer.plugins.extract.canvas(app.stage) as HTMLCanvasElement
    canvas.toBlob(blob => {
      blob ? saveAs(blob, 'image.jpg') : alert('Download failed')
    }, 'image/jpeg')
  }, [])

  const handlePile = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    setPile(+value)
  }, [])

  const downloadButton = useMemo(
    () => (
      <DownloadSection>
        <button onClick={handleDownload}>Download</button>
      </DownloadSection>
    ),
    []
  )

  return (
    <>
      <Container>
        <InputSection>
          <input type="file" accept="image/*" onChange={handleFiles} />
          <label>
            Pile: <input type="range" min="1" max="10" value={pile} onChange={handlePile} />
          </label>
        </InputSection>
        <FiltersSection>
          <FilterSection>
            <h2>Before</h2>
            <Stage {...canvasSize}>{base64 && <Sprite image={base64} {...canvasSize} />}</Stage>
          </FilterSection>
          <FilterSection>
            <h2>Kuwahara Filter</h2>
            <Stage {...canvasSize} ref={stagetEl}>
              {base64 && <Sprite image={base64} filters={[...Array(pile)].map(() => KuwaharaFilter)} {...canvasSize} />}
            </Stage>
            {base64 && downloadButton}
          </FilterSection>
          <FilterSection>
            <h2>Bilateral Filter</h2>
            <Stage {...canvasSize}>
              {base64 && (
                <Sprite image={base64} filters={[...Array(pile)].map(() => BilateralFilter)} {...canvasSize} />
              )}
            </Stage>
            {base64 && downloadButton}
          </FilterSection>
        </FiltersSection>
      </Container>
    </>
  )
}
