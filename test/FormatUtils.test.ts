import assert from 'node:assert/strict'
import test from 'node:test'
import { FormatUtils } from '../src/FormatUtils'

test('deformats positive and negative scientific notation', () => {
  assert.equal(FormatUtils.deformatNumberToPureString('1.23e+10'), '12300000000')
  assert.equal(FormatUtils.deformatNumberToPureString('1.23e-10'), '0.000000000123')
  assert.equal(FormatUtils.deformatNumberToPureString('-1.23e+10'), '-12300000000')
  assert.equal(FormatUtils.deformatNumberToPureString('-1.23e-10'), '-0.000000000123')
})

test('deformats compact zero-count notation with sign preserved', () => {
  assert.equal(FormatUtils.deformatNumberToPureString('0.0{13}1234'), '0.00000000000001234')
  assert.equal(FormatUtils.deformatNumberToPureString('0.0₁₃1234'), '0.00000000000001234')
  assert.equal(FormatUtils.deformatNumberToPureString('-0.0{5}1234'), '-0.000001234')
  assert.equal(FormatUtils.deformatNumberToPureString('-0.0₅1234'), '-0.000001234')
})

test('converts units without dropping or corrupting negative signs', () => {
  assert.equal(FormatUtils.toUnits(1, 18), 1000000000000000000n)
  assert.equal(FormatUtils.fromUnits(120000000000000000n, 18), '0.12')
  assert.equal(FormatUtils.toUnits('-1.23', 2), -123n)
  assert.equal(FormatUtils.toUnits('-0.001', 2), 0n)
  assert.equal(FormatUtils.fromUnits('-123', 2), '-1.23')
  assert.equal(FormatUtils.fromUnits('-123', 5), '-0.00123')
})

test('formats readable numbers for positive and negative values', () => {
  assert.equal(FormatUtils.shitNumber(0.0000000000000123456), '0.0{13}1234')
  assert.equal(FormatUtils.shitNumber('0.0000456', 2, 4), '0.000045')
  assert.equal(FormatUtils.shitNumber('0.000000456', 2, 4), '0.0{6}45')
  assert.equal(FormatUtils.shitNumber(-1234.567), '-1234.57')
  assert.equal(FormatUtils.shitNumber(-0.000000456), '-0.0{6}456')
  assert.equal(FormatUtils.shitNumber2(-0.000000456), '-0.0₆456')
})

test('compacts and groups negative numbers using absolute-value thresholds', () => {
  assert.equal(FormatUtils.compactNumber(1234), '1.23k')
  assert.equal(FormatUtils.compactNumber(-1234), '-1.23k')
  assert.equal(FormatUtils.groupBy3Numbers('-1234567.89'), '-1,234,567.89')
  assert.equal(FormatUtils.formatByShorten(1234, '$'), '$1.23k')
  assert.equal(FormatUtils.formatByShorten(-1234, '$'), '$-1.23k')
  assert.equal(FormatUtils.formatByGrouped(1234, '$'), '$1,234')
  assert.equal(FormatUtils.formatByGrouped(-1234, '$'), '$-1,234')
})

test('scales negative numbers correctly', () => {
  assert.equal(FormatUtils.numberScale('-1.5', 2), '-3')
})
