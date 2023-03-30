import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";
import { MapperController } from "./MapperController";
import { Server } from "../../Server";

describe("MapperController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server, {
    mount: {
      "/": [MapperController]
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it("should call GET /mapper", async () => {
     const response = await request.get("/mapper").expect(200);

     expect(response.text).toEqual("hello");
  });
});
