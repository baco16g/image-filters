import { Sprite, Stage } from '@inlet/react-pixi'
import React, { ChangeEvent, SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { convertBlobToBase64, download, getAspectRatioOfBase64 } from '../utils'
import useFilter from './hooks/useFilter'
import { Container, DownloadSection, FiltersSection, InputSection } from './styled'

const initialCanvasSize = { width: 500, height: 500 }

export default function Filter() {
  const [canvasSize, setCanvasSize] = useState(initialCanvasSize)
  const [base64, setBase64] = useState<string | null>(null)
  const { KuwaharaFilter, BilateralFilter } = useFilter({ ...canvasSize })

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
    const stageElement: any = event.currentTarget.previousElementSibling
    if (!stageElement) {
      alert('Download failed')
      return
    }
    const app = stageElement.app
    const _base64 = app.renderer.plugins.extract.base64(app.stage)
    download(_base64, 'image.jpg')
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
        </InputSection>
        <FiltersSection>
          <section>
            <h2>Before</h2>
            <Stage {...canvasSize}>{base64 && <Sprite image={base64} {...canvasSize} />}</Stage>
          </section>
          <section>
            <h2>Kuwahara Filter</h2>
            <Stage {...canvasSize}>
              {base64 && <Sprite image={base64} filters={[KuwaharaFilter]} {...canvasSize} />}
            </Stage>
            {base64 && downloadButton}
          </section>
          <section>
            <h2>Bilateral Filter</h2>
            <Stage {...canvasSize}>
              {base64 && <Sprite image={base64} filters={[BilateralFilter]} {...canvasSize} />}
            </Stage>
            {base64 && downloadButton}
          </section>
        </FiltersSection>
      </Container>
    </>
  )
}
