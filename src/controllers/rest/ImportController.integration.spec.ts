import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";
import { ImportController } from "./ImportController";
import { Server } from "../../Server";

describe("ImportController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server, {
    mount: {
      "/": [ImportController]
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it("should call GET /import", async () => {
     const response = await request.get("/import").expect(200);

     expect(response.text).toEqual("hello");
  });
});
