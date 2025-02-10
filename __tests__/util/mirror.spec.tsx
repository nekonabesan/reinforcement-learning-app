import Mirror from '../../util/mirror';

test("", () => {
    expect(Mirror(0, [[1,2,3],[4,5,6],[7,8,9]]))
    .toEqual([[1,2,3],[4,5,6],[7,8,9]]);
});