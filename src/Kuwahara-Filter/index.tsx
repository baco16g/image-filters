import { Sprite, Stage } from '@inlet/react-pixi'
import React, { ChangeEvent, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { convertBlobToBase64, download, getAspectRatioOfBase64 } from '../utils'
import useFilter from './hooks/useFilter'

const initialCanvasSize = { width: 500, height: 500 }

const Container = styled.div`
  text-align: center;
`

const InputSection = styled.div`
  margin-bottom: 10px;
`

const DownloadSection = styled.div`
  margin-top: 10px;
`

export default function App() {
  const stageRef = useRef<ReactPixi.Stage & { app: PIXI.Application }>(null)
  const [canvasSize, setCanvasSize] = useState(initialCanvasSize)
  const [base64, setBase64] = useState<string | null>(null)
  const { KuwaharaFilter } = useFilter({ ...canvasSize })

  const handleFiles = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.prototype.slice.call(event.target.files)
    try {
      setCanvasSize(initialCanvasSize)
      const _base64 = await convertBlobToBase64(files[0])
      setBase64(_base64)
      const aspectRatio = await getAspectRatioOfBase64(_base64)
      setCanvasSize(prev => ({ ...prev, width: prev.width * aspectRatio }))
    } catch (err) {
      alert(err.message)
    }
  }, [])

  const handleDownload = useCallback(() => {
    const stageElement = stageRef.current
    if (!stageElement) {
      alert('Download failed')
      return
    }
    const app = stageElement.app
    const _base64 = app.renderer.plugins.extract.base64(app.stage)
    download(_base64, 'image.jpg')
  }, [])

  return (
    <>
      <Container>
        <InputSection>
          <input type="file" accept="image/*" onChange={handleFiles} />
        </InputSection>
        <Stage ref={stageRef} {...canvasSize}>
          {base64 && <Sprite image={base64} filters={[KuwaharaFilter]} {...canvasSize} />}
        </Stage>
        {base64 && (
          <DownloadSection>
            <button onClick={handleDownload}>Download</button>
          </DownloadSection>
        )}
      </Container>
    </>
  )
}
