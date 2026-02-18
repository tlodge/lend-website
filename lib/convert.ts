import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

let ffmpegInstance: FFmpeg | null = null

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance
  }

  const ffmpeg = new FFmpeg()

  await ffmpeg.load({
    coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
    wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
  })

  ffmpegInstance = ffmpeg
  return ffmpeg
}

export async function convertToMp3(
  inputBlob: Blob,
  onProgress?: (ratio: number) => void
): Promise<Blob> {

  const ffmpeg = await getFFmpeg()

  const progressHandler = onProgress
    ? ({ progress }: { progress: number }) => onProgress(progress)
    : undefined

  if (progressHandler) {
    ffmpeg.on('progress', progressHandler)
  }

  const inputData = await fetchFile(inputBlob)

  await ffmpeg.writeFile('input.webm', inputData)

  await ffmpeg.exec([
    '-i', 'input.webm',
    '-vn',
    '-ab', '128k',
    '-ar', '44100',
    '-f', 'mp3',
    'output.mp3'
  ])

  const output = await ffmpeg.readFile('output.mp3')

  await ffmpeg.deleteFile('input.webm')
  await ffmpeg.deleteFile('output.mp3')

  if (progressHandler) {
    ffmpeg.off('progress', progressHandler)
  }

 const outputData = output as Uint8Array
const copy = new Uint8Array(outputData) // forces new ArrayBuffer

return new Blob([copy], {
  type: 'audio/mpeg',
})
}

export async function convertToMp4(
  inputBlob: Blob,
  onProgress?: (ratio: number) => void
): Promise<Blob> {

  const ffmpeg = await getFFmpeg()

  const progressHandler = onProgress
    ? ({ progress }: { progress: number }) => onProgress(progress)
    : undefined

  if (progressHandler) {
    ffmpeg.on('progress', progressHandler)
  }

  const inputData = await fetchFile(inputBlob)

  await ffmpeg.writeFile('input.webm', inputData)

  await ffmpeg.exec([
    '-i', 'input.webm',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-movflags', '+faststart',
    'output.mp4'
  ])

  const output = await ffmpeg.readFile('output.mp4')

  await ffmpeg.deleteFile('input.webm')
  await ffmpeg.deleteFile('output.mp4')

  if (progressHandler) {
    ffmpeg.off('progress', progressHandler)
  }

 const buffer = (output as Uint8Array).buffer.slice(0)

const outputData = output as Uint8Array
const copy = new Uint8Array(outputData)

return new Blob([copy], {
  type: 'video/mp4',
})
}
