import tacto, { sorters, asc, desc } from '../'

describe('Tacto', () => {
  it('Should return shallow copies', () => {
    const a = [4, 3, 3, 5, 9, 8]
    expect(tacto<number>(sorters.asc((x) => x))(a)).not.toBe(a)
  })

  it('Should sort numbers', () => {
    expect(tacto<number>(sorters.asc((x) => x))([4, 2, 3, 5, 9, 8])).toEqual([2, 3, 4, 5, 8, 9])
  })

  it('Can sort anything given a numeric value', () => {
    expect(tacto<string>(sorters.desc((x) => x.charCodeAt(0)))(['x', 'd', 'e', 'i', 'b', 'w'])).toEqual([
      'x',
      'w',
      'i',
      'e',
      'd',
      'b'
    ])
  })

  it('Allows custom sort implementations', () => {
    expect(tacto<string>(sorters.raw((a, b) => a.localeCompare(b)))(['cat', 'dog', 'bird'])).toEqual([
      'bird',
      'cat',
      'dog'
    ])
  })

  it('Can perform compound sorts', () => {
    const sort = tacto<string>(
      // Sort by the first character ascending
      sorters.asc((x) => x.charCodeAt(0)),
      // Then sort by the last character descending
      sorters.desc((x) => x.charCodeAt(x.length - 1))
    )
    expect(sort(['xta', 'xvb', 'xwc', 'aey', 'axb', 'aqh'])).toEqual(['aey', 'aqh', 'axb', 'xwc', 'xvb', 'xta'])
  })

  it('Provides convenience functions for simple ascending and descending sorts', () => {
    expect(asc([10, 101, 10001])).toEqual([10, 101, 10001])
    expect(desc([10, 101, 10001])).toEqual([10001, 101, 10])
    expect(asc(['10', '101', '10001'])).toEqual(['10', '10001', '101'])
    expect(desc(['10', '101', '10001'])).toEqual(['101', '10001', '10'])
  })
})
