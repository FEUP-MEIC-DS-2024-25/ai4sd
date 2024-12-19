const sum = require('./code_file')

test('properly adds two numbers', () => {
    expect(sum(1, 2)).toBe(3)
})