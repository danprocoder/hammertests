import { TestCase } from "@qa/models";
import { EdgeCaseService } from "./edge-case";
import { Types } from "mongoose";
import { CodeGeneratorService } from "./code-generator";

export class TestCaseService {
    public static async createNewTestCase(
        projectId: Types.ObjectId,
        userId: Types.ObjectId,
        planId: Types.ObjectId,
        featureId: Types.ObjectId,
        testCase: any,
        edgeCases: any[]
    ): Promise<void> {
        const testCaseCode = await CodeGeneratorService.generateCode('TC', projectId);

        const newTestCase = await TestCase.create({
            user: userId,
            planId,
            featureId,
            code: testCaseCode,
            name: testCase.name,
            description: testCase.description,
            order: testCase.order,
            stepsToTest: testCase.stepsToTest
        });

        await EdgeCaseService.createEdgeCases(projectId, userId, planId, newTestCase._id.toString(), edgeCases ?? []);
    }
}
