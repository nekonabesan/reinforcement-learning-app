import Rotation from '../../util/rotation';

test("", () => {
    expect(Rotation(0, [[1,2,3],[4,5,6],[7,8,9]]))
    .toEqual([[1,2,3],[4,5,6],[7,8,9]]);
});