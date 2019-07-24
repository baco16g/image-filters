import { saveAs } from 'file-saver'

export const convertBlobToBase64 = (blob: Blob): Promise<any> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result)
      } else {
        reject('File does not exist.')
      }
    }
    reader.readAsDataURL(blob)
  })

export const convertBase64ToBlob = (base64: string, mimetype: string): Blob => {
  const bom = new Uint8Array([0xef, 0xbb, 0xbf])
  const bin = atob(base64.replace(/^.*,/, ''))
  const buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }
  try {
    return new Blob([bom, buffer.buffer], {
      type: mimetype,
    })
  } catch (e) {
    throw e.message
  }
}

export const getAspectRatioOfBase64 = (base64: string): Promise<number> =>
  new Promise(resolve => {
    const image = new Image()
    image.onload = () => {
      resolve(image.naturalWidth / image.naturalHeight)
    }
    image.src = base64
  })
