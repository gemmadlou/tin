import {Controller, Inject} from "@tsed/di";
import { BadRequest } from "@tsed/exceptions";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { MapperModel, MappersRepository } from "@tsed/prisma";
import {Delete, Get, Groups, Post, Returns, Summary} from "@tsed/schema";
import Ajv from "ajv";

let isValidSchema = (data : MapperModel['config']) : boolean | Promise<unknown> => {
  const ajv = new Ajv();
  const validate = ajv.compile(require('../../config/schema/mapper.json'));
  return validate(data)
}

@Controller("/mappers")
export class MapperController {
  @Inject()
  protected service: MappersRepository;

  @Get('/:id')
  @Summary("Get a mapper")
  @Returns(200, MapperModel)
  async get(@PathParams('id') id: number): Promise<MapperModel|null> {
    return await this.service.findUnique({ where: { id } })
  }

  @Get('/')
  @Summary("Get all mappers")
  @Returns(200, MapperModel)
  async getAll(): Promise<MapperModel[]> {
    return await this.service.findMany()
  }

  @Post('/')
  @Summary("Create a new mapper")
  @Returns(201, MapperModel)
  async create(@BodyParams() @Groups("creation") model: MapperModel): Promise<MapperModel> {
    let valid = isValidSchema(model.config)
    if (!valid) {
      throw new BadRequest("Invalid mapper"); 
    }

    return await this.service.create({ data: model })
  }

  @Post('/:id')
  @Summary("Update mapper")
  @Returns(200, MapperModel)
  async update(@PathParams('id') id: number, @BodyParams() @Groups("creation") mapper: MapperModel): Promise<MapperModel> {
    return await this.service.update({ 
      where: { id }, 
      data: {
        ...mapper
      }
    });
  }

  @Delete('/:id')
  @Summary("Delete mapper")
  @Returns(204)
  async delete(@PathParams('id') id: number): Promise<void> {
    await this.service.delete({ where: { id }});
    return;
  }
}
