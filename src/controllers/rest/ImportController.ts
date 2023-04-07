import { BodyParams, MultipartFile, PathParams, PlatformMulterFile, Req, Use } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Groups, Post, Property, Required, Returns, Summary } from "@tsed/schema";
import { ImportDataModel, ImportDataRepository, ImportModel, ImportsRepository, MappersRepository, TransformDataModel, TransformDataRepository } from "@tsed/prisma";
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

class TransformRequest {
  @Property()
  @Required()
  mapperId: number;
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
  
  @Inject()
  protected data: ImportDataRepository
  
  @Inject()
  protected mapper: MappersRepository
  
  @Inject()
  protected transformer: TransformDataRepository

  @Get('/:id')
  @Summary("Get an import")
  @Returns(200, ImportModel)
  async get(@PathParams('id') id: number): Promise<ImportModel|null> {
    return await this.service.findUnique({ where: { id } })
  }

  @Get('/:id/data')
  @Summary("Get an import data")
  @Returns(200, ImportModel)
  async getData(@PathParams('id') id: number): Promise<ImportDataModel[]> {
    return await this.data.findMany({ where: { importId: id } })
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
      }
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

  @Post('/:id/transform')
  @Summary("Transform import")
  @Returns(200, ImportModel)
  async transform(
    @PathParams('id') id: number, 
    @BodyParams() body: TransformRequest,
  ): Promise<TransformDataModel[]> {

    let datas = await this.data.findMany({ where: { importId: id } })
    let mapper = await this.mapper.findUnique({ where: { id: body.mapperId }})

    // Delete previous transforms
    await this.transformer.collection.deleteMany({
      where: {
        importId: id
      },
    })

    // Transform into schema
    let transformed = datas.map((data: ImportDataModel) => {
      let dict = {}
      
      // Map each field
      for (let field in mapper?.config) {
        let fields = mapper?.config[field].fields

        // Join multiple fields together
        let found = fields
          .reduce((a: any[], b: any) => {
            return a.concat(data.row[b])
          }, [])
          .join(" ");
        
        dict[field] = found
        
      }

      return dict

    })

    return await this.transformer.collection.createMany({
      data: transformed.map((row: object) => {
        return {
          importId: id,
          row
        }
      }),
      skipDuplicates: true
    })
  }

  @Delete('/:id')
  @Summary("Delete import")
  @Returns(204)
  async delete(@PathParams('id') id: number): Promise<void> {
    await this.service.delete({ where: { id }});
    return;
  }
}
