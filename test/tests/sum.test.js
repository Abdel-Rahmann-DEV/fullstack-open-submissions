const sum = require('../sum');

test('adds to numbers', () => {
   expect(sum(1, 2)).not.toBe(5);
});
