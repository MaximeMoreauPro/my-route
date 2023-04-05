import { add } from "./add"

describe('add', () => {
    it('should return the sum of the 2 parameters', () => {
        const result = add(1,2);
        expect(result).toBe(3)
    })
})