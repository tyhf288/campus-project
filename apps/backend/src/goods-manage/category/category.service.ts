import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'
import { EntityManager, EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'

@Injectable()
export class CategoryService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = this.em.create(Category, {
      name: dto.name,
      sort: dto.sort,
      enable: dto.enable,
      createAt: new Date(),
    })
    await this.em.flush()
    return category
  }

  async findAll() {
    return await this.categoryRepository.findAll({ orderBy: { sort: 'DESC' } })
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOneOrFail(id)
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.categoryRepository.nativeUpdate({ id }, dto)
    return { id, ...dto }
  }

  async remove(id: number) {
    await this.categoryRepository.nativeDelete({ id })
    return { id }
  }
}
