import { add } from './add';

describe('add', () => {
  it('should return the sum of the 2 numbers', () => {
    const result = add(0, 0);
    expect(result).toBe(0);

    const result2 = add(-5, 15);
    expect(result2).toBe(10);

    const result3 = add(-5, -5);
    expect(result3).toBe(-10);

    const result4 = add(5, 5);
    expect(result4).toBe(10);
  });
});
