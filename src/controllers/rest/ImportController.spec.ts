import { PlatformTest } from "@tsed/common";
import { ImportController } from "./ImportController";

describe("ImportController", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should do something", () => {
    const instance = PlatformTest.get<ImportController>(ImportController);
    // const instance = PlatformTest.invoke<ImportController>(ImportController); // get fresh instance

    expect(instance).toBeInstanceOf(ImportController);
  });
});
