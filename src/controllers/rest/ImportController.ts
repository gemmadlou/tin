import { BodyParams, MultipartFile, PlatformMulterFile, Req, Use } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { Get, Groups, Post, Property, Required, Returns } from "@tsed/schema";
import { ImportModel, ImportsRepository } from "@tsed/prisma";
import multer from "multer";

class MultiPartFileSchema {
  @Property()
  fieldname: string;

  @Property()
  originalname: string;

  @Property()
  encoding: string;

  @Property()
  mimetype: string;

  @Property()
  destination: string;

  @Property()
  filename: string;

  @Property()
  path: string;

  @Property()
  size: number;
}

class PostRequest {
  // @Property()
  // @Required()
  // file: PlatformMulterFile

  @Property()
  @Required()
  schemaId: number;
}


@Controller("/imports")
export class ImportController {

  @Inject()
  protected service: ImportsRepository;

  @Get("/")
  get() {
    return "hello";
  }


  @Post("/")
  @Returns(ImportModel)
  async uploadFile(
    // @BodyParams() @Groups("creation") model: ImportModel,
    // @MultipartFileRequired("file") file: MultiPartFileSchema,
    @BodyParams() body: PostRequest,
    @MultipartFile("file") @Required() file: MultipartFile
  ): Promise<ImportModel> {
    console.log({ body, file })

    let data = new ImportModel()
    data.mimetype = file.mimetype;
    data.schemaId = body.schemaId
    data.originalName = file.originalname
    data.filename = file.filename
    data.filepath = file.path
    data.size = file.size

    console.log({data})

    let created = await this.service.create({ data })

    return created;
  }

  // This is the configuration for the Multer middleware, which handles file uploads.
  @Use(multer({ dest: "uploads/" }).single("file"))
  private fileUploadMiddleware() { }
}
