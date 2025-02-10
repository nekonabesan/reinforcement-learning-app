import Rotation from '../../util/rotation';

// npm run test __tests__/util/rotation.spec.tsx
test("回転無し", () => {
    expect(Rotation(0, [[1,2,3],[4,5,6],[7,8,9]]))
    .toEqual([[1,2,3],[4,5,6],[7,8,9]]);
});

test("90度回転", () => {
    expect(Rotation(1, [[1,2,3],[4,5,6],[7,8,9]]))
    .toEqual([[3,6,9],[2,5,8],[1,4,7]]);
});

test("180度回転", () => {
    expect(Rotation(2, [[1,2,3],[4,5,6],[7,8,9]]))
    .toEqual([[9,8,7],[6,5,4],[3,2,1]]);
});

test("270度回転", () => {
    expect(Rotation(3, [[1,2,3],[4,5,6],[7,8,9]]))
    .toEqual([[7,4,1],[8,5,2],[9,6,3]]);
});
