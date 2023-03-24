import { BodyParams, Delete, Get, Inject, PathParams, Post, Put } from '@tsed/common';
import { Groups, Returns, Summary } from '@tsed/schema';
import {Controller} from "@tsed/di";
import {SchemaModel, SchemataRepository} from "@tsed/prisma";


@Controller('/schemas')
export class SchemaController {
  @Inject()
  protected schema: SchemataRepository;

  @Get('/:id')
  @Summary("Get a schema")
  @Returns(200, SchemaModel)
  async get(@PathParams('id') id: number): Promise<SchemaModel|null> {
    return await this.schema.findUnique({ where: { id } })
  }

  @Get('/')
  @Summary("Get all schemas")
  @Returns(200, SchemaModel)
  async getAll(): Promise<SchemaModel[]> {
    return await this.schema.findMany()
  }

  @Post('/')
  @Summary("Create a new schema")
  @Returns(201, SchemaModel)
  async create(@BodyParams() @Groups("creation") schema: SchemaModel): Promise<SchemaModel> {
    return await this.schema.create({ data: schema })
  }

  @Post('/:id')
  @Summary("Update schema")
  @Returns(200, SchemaModel)
  async update(@PathParams('id') id: number, @BodyParams() @Groups("creation") schema: SchemaModel): Promise<SchemaModel> {
    return await this.schema.update({ 
      where: { id }, 
      data: {
        ...schema
      }
    });
  }

  @Delete('/:id')
  @Summary("Delete schema")
  @Returns(204)
  async delete(@PathParams('id') id: number): Promise<void> {
    await this.schema.delete({ where: { id }});
    return;
  }
}
