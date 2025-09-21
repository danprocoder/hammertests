import { EdgeCase, IEdgeCase } from "@qa/models";
import { Types } from "mongoose";
import { CodeGeneratorService } from "./code-generator";

export class EdgeCaseService {
    public static async createEdgeCases(
        projectId: Types.ObjectId,
        userId: Types.ObjectId,
        planId: Types.ObjectId,
        testCaseId: string,
        edgeCases: Pick<IEdgeCase, 'title' | 'expectation' | 'order'>[]
    ): Promise<Types.ObjectId[]> {
        const ids: Types.ObjectId[] = [];
        for (let ec of edgeCases) {
            const edgeCaseCode = await CodeGeneratorService.generateCode('EC', projectId);

            const edgeCase = await EdgeCase.create({
                user: userId,
                plan: planId,
                testCase: testCaseId,
                code: edgeCaseCode,
                title: ec.title,
                expectation: ec.expectation,
                order: ec.order
            });
            ids.push(edgeCase._id);
        }
        return ids;
    }
}
