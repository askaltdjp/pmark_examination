import { MTest } from ".prisma/client_master";
import { masterPrisma } from "@/lib/prisma/masterPrisma";
import { MTestRepository } from "@/lib/repositories/master/mTestRepository";
import { currentJST } from "@/lib/utils/timeUtils";

// 固定された日時（全テストで共通に使用）
const fixedDate = new Date("2025-08-29T11:01:20Z");

// モック化（MTestRepositoryの依存モジュール）
jest.mock("@/lib/prisma/masterPrisma", () => ({
    masterPrisma: {
        mTest: {
            findFirst: jest.fn(),
        },
    },
}));
jest.mock("@/lib/utils/timeUtils");

describe("mTestRepository.ts", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("MTestRepository", () => {
        describe("findById", () => {
            test("m_testにidに相当するレコードが存在すれば、MTestオブジェクトを返却する", async () => {
                const id = 1;
                const mTest: MTest = {
                    id,
                    name: "Pマーク試験",
                    startAt: fixedDate,
                    endAt: fixedDate,
                    questionNum: 10,
                    passNum: 8,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                };
                (masterPrisma.mTest.findFirst as jest.Mock).mockResolvedValue(mTest);

                const result = await MTestRepository.findById(id);

                expect(masterPrisma.mTest.findFirst).toHaveBeenCalledWith({
                    where: {
                        id,
                        deleteAt: null,
                    },
                });
                expect(result).toEqual(mTest);
            });

            test("m_testにidに相当するレコードが存在しなければ、nullを返却する", async () => {
                (masterPrisma.mTest.findFirst as jest.Mock).mockResolvedValue(null);

                const id = 999;
                const result = await MTestRepository.findById(id);

                expect(masterPrisma.mTest.findFirst).toHaveBeenCalledWith({
                    where: {
                        id,
                        deleteAt: null,
                    },
                });
                expect(result).toBeNull();
            });
        });

        describe("findActive", () => {
            test("開催中の試験が存在すれば、MTestオブジェクトを返却する", async () => {
                const mTest: MTest = {
                    id: 1,
                    name: "Pマーク試験",
                    startAt: fixedDate,
                    endAt: fixedDate,
                    questionNum: 10,
                    passNum: 8,
                    createAt: fixedDate,
                    updateAt: fixedDate,
                    deleteAt: null,
                };
                (masterPrisma.mTest.findFirst as jest.Mock).mockResolvedValue(mTest);
                (currentJST as jest.Mock).mockReturnValue(fixedDate);

                const result = await MTestRepository.findActive();

                expect(masterPrisma.mTest.findFirst).toHaveBeenCalledWith({
                    where: {
                        startAt: { lte: fixedDate },
                        endAt: { gte: fixedDate },
                        deleteAt: null,
                    },
                });
                expect(result).toEqual(mTest);
            });

            test("開催中の試験が存在しなければ、nullを返却する", async () => {
                (masterPrisma.mTest.findFirst as jest.Mock).mockResolvedValue(null);
                (currentJST as jest.Mock).mockReturnValue(fixedDate);

                const result = await MTestRepository.findActive();

                expect(masterPrisma.mTest.findFirst).toHaveBeenCalledWith({
                    where: {
                        startAt: { lte: fixedDate },
                        endAt: { gte: fixedDate },
                        deleteAt: null,
                    },
                });
                expect(result).toBeNull();
            });
        });
    });
});