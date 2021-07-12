function workerScriptBootstrap() {
  function ImageGrey(imagedata) {
    this.width = imagedata.width
    this.height = imagedata.height
    this.data = new Uint8ClampedArray(this.width * this.height)

    let index = 0
    for (let i = 0; i < imagedata.data.length; i += 4) {
      // copied from OpenCV docs
      // RGB[A] to Gray:Y←0.299⋅R+0.587⋅G+0.114⋅B
      // https://docs.opencv.org/master/de/d25/imgproc_color_conversions.html#color_convert_rgb_gray
      this.data[index++] =
        imagedata.data[i] * 0.299 +
        imagedata.data[i + 1] * 0.587 +
        imagedata.data[i + 2] * 0.114
    }

    this.pad = function (top, bottom, left, right) {
      const fWidth = this.width + left + right
      const fHeight = this.height + top + bottom
      const arr = new Uint8ClampedArray(fWidth * fHeight)

      for (let y = 0; y < fHeight; y++) {
        for (let x = 0; x < fWidth; x++) {
          let cx = Math.abs(-left + x)
          let cy = Math.abs(-top + y)

          if (cx >= this.width) {
            cx = this.width - (cx % this.width) - 1
          }

          if (cy >= this.height) {
            cy = this.height - (cy % this.height) - 1
          }

          arr[y * fWidth + x] = this.data[cy * this.width + cx]
        }
      }

      this.data = arr
      this.width = fWidth
      this.height = fHeight
    }

    this.getIntegral = function () {
      const arr = new Uint32Array(this.width * this.height)
      for (let x = 0; x < this.width; x++) {
        let sum = 0
        for (let y = 0; y < this.height; y++) {
          const index = y * this.width + x
          sum += this.data[index]

          if (x === 0) {
            arr[index] = sum
          } else {
            arr[index] = arr[y * this.width + x - 1] + sum
          }
        }
      }

      return arr
    }

    this.toRGBAImageData = function () {
      return ImageGrey.toRGBAImageData(this.data, this.width, this.height)
    }
  }

  ImageGrey.toRGBAImageData = function (data, width, height) {
    const arr = new Uint8ClampedArray(width * height * 4)
    for (let i = 0; i < data.length; i++) {
      const index = i * 4
      const col = data[i]
      arr[index] = col
      arr[index + 1] = col
      arr[index + 2] = col
      arr[index + 3] = 255
    }
    return new ImageData(arr, width, height)
  }

  function addpativeThreshold(imageData, threshold = 25) {
    const image8 = new ImageGrey(imageData)
    const oData = new Uint8ClampedArray(image8.data)
    const oWidth = image8.width
    const oHeight = image8.height

    const wWidth = Math.floor(oWidth / 16) + 1
    const wHeight = Math.floor(oHeight / 16) + 1

    const hww = Math.round(wWidth / 2) - 1
    const hwh = Math.round(wHeight / 2) - 1

    image8.pad(hwh, hwh, hww, hww)
    const pWidth = image8.width

    const integral = image8.getIntegral()
    const data = new Uint8ClampedArray(oWidth * oHeight)

    for (let x = 0; x < oWidth; x++) {
      for (let y = 0; y < oHeight; y++) {
        const x1 = x
        const x2 = x + wWidth
        const y1 = y
        const y2 = y + wHeight

        const count = (x2 - x1) * (y2 - y1)
        const sum =
          integral[y2 * pWidth + x2] -
          integral[(y1 - 1) * pWidth + x2] -
          integral[y2 * pWidth + x1 - 1] +
          integral[(y1 - 1) * pWidth + x1 - 1]

        data[y * oWidth + x] =
          oData[y * oWidth + x] * count <= (sum * (100 - threshold)) / 100
            ? 0
            : 255
      }
    }

    return ImageGrey.toRGBAImageData(data, oWidth, oHeight)
  }

  return addpativeThreshold
}

const idGen = (() => {
  let id = 0
  return () => ++id
})()

function createWorker() {
  const workerScript = `
const addpativeThreshold = ${workerScriptBootstrap.toString()}()

self.onmessage = function({ data }) {
    const { imagedata, threshold, ...rest } = data
    const result = addpativeThreshold(imagedata, threshold)
    self.postMessage({ imagedata: result, ...rest })
}
`
  const worker = new Worker(
    window.URL.createObjectURL(
      new Blob([workerScript], { type: 'application/javascript' })
    )
  )
  return worker
}

const jobs = {}
const worker = createWorker()
worker.onmessage = ({ data }) => {
  const { id, imagedata } = data
  jobs[id](imagedata)
  delete jobs[id]
}

const createProcessJob = (args, callback) => {
  const id = idGen()
  jobs[id] = callback
  worker.postMessage({ id, ...args })
}

const processImageData = function (imagedata, threshold) {
  return new Promise((resolve) => {
    createProcessJob({ imagedata, threshold }, resolve)
  })
}

export { processImageData }
