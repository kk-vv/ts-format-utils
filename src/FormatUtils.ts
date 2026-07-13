function splitSign(text: string) {
  if (text.startsWith('-')) {
    return { sign: '-', unsigned: text.substring(1) }
  }
  if (text.startsWith('+')) {
    return { sign: '', unsigned: text.substring(1) }
  }
  return { sign: '', unsigned: text }
}

function applySign(sign: string, text: string) {
  return sign === '-' && !/^0(?:\.0*)?$/.test(text) ? '-' + text : text
}

function normalizeIntegerString(text: string) {
  return text.replace(/^0+/, '') || '0'
}

export const FormatUtils = {
  toUnits(src: number | string | bigint, decimal: number = 9): bigint {
    return BigInt(this.quantityMultiplyDecimal(`${src}`, decimal))
  },
  fromUnits(src: number | string | bigint, decimal: number = 9): string {
    return this.quantityDivideDecimal(`${src}`, decimal)
  },
  deformatNumberToPureString(shitNumber: string) {
    const { sign, unsigned } = splitSign(shitNumber)
    const scientistMatchGroups = unsigned.match(/^(\d+)(?:\.(\d+))?[eE]([-+]?)(\d+)$/)
    if (scientistMatchGroups && scientistMatchGroups.length === 5) { //scientist number
      const integerPart = scientistMatchGroups[1]
      const decimalPart = scientistMatchGroups[2] || ''
      const symbol = scientistMatchGroups[3] || '+'
      const exponent = Number(scientistMatchGroups[4]) * (symbol === '-' ? -1 : 1)
      const digits = integerPart + decimalPart
      const decimalIndex = integerPart.length + exponent
      let fixStr = ''
      if (decimalIndex <= 0) {
        fixStr = '0.' + '0'.repeat(Math.abs(decimalIndex)) + digits
      } else if (decimalIndex >= digits.length) {
        fixStr = digits + '0'.repeat(decimalIndex - digits.length)
      } else {
        fixStr = digits.substring(0, decimalIndex) + '.' + digits.substring(decimalIndex)
      }
      return applySign(sign, this.removeDecimalTailZeros(fixStr))
    } else {
      const shitfortmatNumer = this.revertSubSymbol(unsigned)
      const shitNumberMatchGroups = shitfortmatNumer.match(/^0\.0\{(\d+)\}(\d+)$/)
      if (shitNumberMatchGroups && shitNumberMatchGroups.length === 3) { //shit number 0.0{5}1234
        const fixStr = '0.' + '0'.repeat(Number(shitNumberMatchGroups[1])) + shitNumberMatchGroups[2]
        return applySign(sign, this.removeDecimalTailZeros(fixStr))
      }
    }
    return shitNumber
  },
  quantityDivideDecimal(quantity: string, decimal: number) {
    const pureString = this.deformatNumberToPureString(quantity)
    const { sign, unsigned } = splitSign(pureString)
    let numbers = unsigned.split('.')[0].replace(/^0+/, "")
    if (numbers.length > 0) {
      const dt = (decimal + 1) - numbers.length
      if (dt > 0) {
        numbers = '0'.repeat(dt) + numbers
      }
      let offset = numbers.length - decimal
      if (offset === 0) {
        offset = 1
      }
      return applySign(sign, this.removeDecimalTailZeros([numbers.substring(0, offset), '.', numbers.substring(offset)].join('')))
    } else {
      return '0'
    }
  },
  quantityMultiplyDecimal(quantity: string, decimal: number) {
    const pureString = this.deformatNumberToPureString(quantity)
    const { sign, unsigned } = splitSign(pureString)
    const numbers = unsigned.split('.')
    let result = ''
    if (numbers.length >= 2) {
      const head = numbers[0]
      const tail = numbers[1]
      const tailDelta = decimal - tail.length
      if (tailDelta <= 0) {
        result = head + tail.substring(0, decimal)
      } else {
        result = head + tail + '0'.repeat(tailDelta)
      }
    } else {
      result = numbers[0] + '0'.repeat(decimal)
    }
    return applySign(sign, normalizeIntegerString(result))
  },
  shitNumber(number: string | number, tailValidNumberCount: number = 4, limitZeroCount: number = 4) {
    let num = 0
    if (typeof (number) === 'string') {
      const value = Number(number)
      if (isNaN(value)) {
        return '0'
      }
      num = value
    } else {
      num = number
    }
    const sign = num < 0 ? '-' : ''
    const absNum = Math.abs(num)
    if (absNum > 1) {
      return applySign(sign, this.removeDecimalTailZeros(absNum.toFixed(2)))
    } else {
      const numStr = absNum.toString()
      const matchGroups = numStr.match(/(\d)(?:\.(\d+))?[e|E]-(\d+)/)
      if (matchGroups && matchGroups.length === 4) { //scientist number
        let tail = matchGroups[1] + (matchGroups[2] || '')
        if (tail.length > tailValidNumberCount) {
          tail = tail.substring(0, tailValidNumberCount)
        }
        let fixStr = '0.' + '0'.repeat(Number(matchGroups[3]) - 1) + tail
        if ((Number(matchGroups[3]) - 1) > limitZeroCount) {
          fixStr = '0.0' + `{${Number(matchGroups[3]) - 1}}` + tail
        }
        return applySign(sign, this.removeDecimalTailZeros(fixStr))
      } else {
        const matchGroups = numStr.match(/0\.(0+)([1-9][0-9]*)/)
        if (matchGroups && matchGroups.length === 3) {
          const zeroCount = matchGroups[1].length
          let tail = matchGroups[2]
          if (tail.length > tailValidNumberCount) {
            tail = tail.substring(0, tailValidNumberCount)
          }
          let fixStr = '0.' + '0'.repeat(zeroCount) + tail
          if (zeroCount > limitZeroCount) {
            fixStr = '0.0' + `{${zeroCount}}` + tail
          }
          fixStr = this.removeDecimalTailZeros(fixStr)
          return applySign(sign, fixStr)
        } else {
          return applySign(sign, this.removeDecimalTailZeros(absNum.toFixed(tailValidNumberCount)))
        }
      }
    }
  },
  compactNumber(number: string | number, digits: number = 2) {
    if (number === undefined || number === null) {
      return ''
    }
    let num = 0
    if (typeof (number) === 'string') {
      const value = Number(number)
      if (isNaN(value)) {
        return number
      }
      num = value
    } else {
      num = number
    }
    const sign = num < 0 ? '-' : ''
    const absNum = Math.abs(num)
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ]
    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/
    const item = lookup.findLast(item => absNum >= item.value)
    return item ? sign + (absNum / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0"
  },
  fixToSubSymbol(v: string) {
    const subscriptMap: { [key: string]: string } = {
      '0': '₀',
      '1': '₁',
      '2': '₂',
      '3': '₃',
      '4': '₄',
      '5': '₅',
      '6': '₆',
      '7': '₇',
      '8': '₈',
      '9': '₉'
    }
    return v.replace(/\{(\d+)\}/g, (_, p1: string) => {
      return p1.split('').map(digit => subscriptMap[digit] || digit).join('')
    })
  },
  revertSubSymbol(v: string) {
    const subscriptToNormalMap: { [key: string]: string } = {
      '₀': '0',
      '₁': '1',
      '₂': '2',
      '₃': '3',
      '₄': '4',
      '₅': '5',
      '₆': '6',
      '₇': '7',
      '₈': '8',
      '₉': '9'
    }
    return v.replace(/[₀-₉]+/g, (match: string) => {
      const normalDigits = match.split('').map(digit => subscriptToNormalMap[digit] || digit).join('')
      return `{${normalDigits}}`
    })
  },
  shitNumber2(text: string | number, tailValidNumberCount: number = 4, limitZeroCount: number = 4) {
    return this.fixToSubSymbol(this.shitNumber(text, tailValidNumberCount, limitZeroCount))
  },
  groupBy3Numbers(text: string | number | undefined | null) {
    if (text !== undefined && text !== null) {
      let valueString = ''
      if (typeof (text) === 'number') {
        valueString = this.deformatNumberToPureString(text.toString())
      } else {
        valueString = text
      }
      if (valueString.includes('.')) {
        const left = valueString.split('.')[0]
        const right = valueString.split('.')[1]
        return left.replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/g, ',') + '.' + right
      } else {
        return valueString.replace(/(?<=\d)(?=(\d\d\d)+(?!\d))/g, ',')
      }
    }
    return ''
  },
  removeDecimalTailZeros(text: string) {
    return text.replace(/\.0+$|(?<=\.[0-9]*[1-9])0+$/, "")
  },
  formatByShorten(amount: string | number | undefined | null, currencySymbol: string | null | boolean = null, placeholder: string = '--'): string {
    currencySymbol = (currencySymbol === true) ? '$' : (currencySymbol === false ? '' : currencySymbol)
    if (amount !== undefined && amount !== null) {
      let num = 0
      if (typeof (amount) === 'string') {
        const value = Number(amount)
        if (isNaN(value)) {
          return '0'
        }
        num = value
      } else {
        num = amount
      }

      if (Math.abs(num) > 1) {
        return (currencySymbol ?? '') + this.compactNumber(amount, 2)
      } else {
        return (currencySymbol ?? '') + this.shitNumber2(num)
      }
    }
    return placeholder
  },
  formatByGrouped(amount: string | number | undefined | null, currencySymbol: string | null | boolean = null, placeholder: string = '--'): string {
    currencySymbol = (currencySymbol === true) ? '$' : (currencySymbol === false ? '' : currencySymbol)
    if (amount !== undefined && amount !== null) {
      let num = 0
      if (typeof (amount) === 'string') {
        const value = Number(amount)
        if (isNaN(value)) {
          return '0'
        }
        num = value
      } else {
        num = amount
      }
      if (Math.abs(num) >= 1) {
        return (currencySymbol ?? '') + this.groupBy3Numbers(this.removeDecimalTailZeros(num.toFixed(2)))
      } else {
        return (currencySymbol ?? '') + this.shitNumber2(amount)
      }
    }
    return placeholder
  },
  formatReadable(amount: string | number | undefined | null, tailValidNumberCount: number = 4, placeholder: string = '--'): string {
    if (amount !== undefined && amount !== null) {
      return this.shitNumber2(amount, tailValidNumberCount)
    }
    return placeholder
  },
  numberScale(price: string | number | bigint, scale: number) {
    const priceValue = this.toUnits(price, 18)
    const scaleValue = this.toUnits(scale, 18)
    const fixedValue = this.fromUnits(priceValue * scaleValue, 36)
    return fixedValue
  }
}
