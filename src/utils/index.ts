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

export const convertBase64ToBlob = (base64: string, mimeCtype: string) => {
  const bom = new Uint8Array([0xef, 0xbb, 0xbf])
  const bin = atob(base64.replace(/^.*,/, ''))
  const buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }
  try {
    return new Blob([bom, buffer.buffer], {
      type: mimeCtype,
    })
  } catch (e) {
    console.log(e.message)
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

export const download = (base64: string, filename: string) => {
  const anchor = document.createElement('a')
  anchor.download = filename
  anchor.href = base64.replace(/^data:image\/[^;]+/, 'data:application/octet-stream')
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}
