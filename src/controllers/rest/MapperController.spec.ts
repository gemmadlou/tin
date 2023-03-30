import { PlatformTest } from "@tsed/common";
import { MapperController } from "./MapperController";

describe("MapperController", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should do something", () => {
    const instance = PlatformTest.get<MapperController>(MapperController);
    // const instance = PlatformTest.invoke<MapperController>(MapperController); // get fresh instance

    expect(instance).toBeInstanceOf(MapperController);
  });
});
