import { BodyParams, MultipartFile, PathParams, PlatformMulterFile, Req, Use } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Groups, Post, Property, Required, Returns, Summary } from "@tsed/schema";
import { ImportModel, ImportsRepository } from "@tsed/prisma";
import * as fs from 'fs';
import XLSX from "xlsx";
import * as csv from 'fast-csv';

class PostRequest {
  @Property()
  @Required()
  schemaId: number;
}

class UpdateRequest {
  @Property()
  @Required()
  schemaId: number;
}

function readDataFromFile(mimetype: string, filePath: string): Promise<any[]> {
  if (mimetype.includes('csv')) {
    const rows: any[] = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('error', reject)
        .on('data', row => rows.push(row))
        .on('end', () => resolve(rows));
    });
  }
  // } else if (filePath.endsWith('.xlsx')) {
  //   // const workbook = XLSX.readFile(filePath);
  //   // const sheetName = workbook.SheetNames[0];
  //   // const worksheet = workbook.Sheets[sheetName];
  //   // console.log(worksheet)
  // } else {
    throw new Error('Unsupported file format');
  // }
}


@Controller("/imports")
export class ImportController {

  @Inject()
  protected service: ImportsRepository;

  @Get('/:id')
  @Summary("Get an import")
  @Returns(200, ImportModel)
  async get(@PathParams('id') id: number): Promise<ImportModel|null> {
    return await this.service.findUnique({ where: { id } })
  }

  @Get('/')
  @Summary("Get all imports")
  @Returns(200, ImportModel)
  async getAll(): Promise<ImportModel[]> {
    return await this.service.findMany()
  }

  @Post("/")
  @Summary("Create a new import")
  @Returns(201, ImportModel)
  async uploadFile(
    @BodyParams() body: PostRequest,
    @MultipartFile("file") @Required() file: MultipartFile
  ): Promise<ImportModel> {

    let data = new ImportModel()
    data.mimetype = file.mimetype;
    data.schemaId = body.schemaId
    data.originalName = file.originalname
    data.filename = file.filename
    data.filepath = file.path
    data.size = file.size

    let result = await readDataFromFile(file.mimetype, file.path)
    return await this.service.create({
      data: {
        ...data,
        data: {
          create: result.map(i => {
            return {
              row: i
            }
          }),
        },
      },
      include: {
        data: true, // Include all posts in the returned object
      },
    })
  }

  @Post('/:id')
  @Summary("Update import")
  @Returns(200, ImportModel)
  async update(
    @PathParams('id') id: number, 
    @BodyParams() body: UpdateRequest,
  ): Promise<ImportModel> {
    return await this.service.update({ 
      where: { id }, 
      data: {
        ...body
      }
    });
  }

  @Delete('/:id')
  @Summary("Delete import")
  @Returns(204)
  async delete(@PathParams('id') id: number): Promise<void> {
    await this.service.delete({ where: { id }});
    return;
  }
}
