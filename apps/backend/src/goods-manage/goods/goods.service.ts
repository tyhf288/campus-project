import { Injectable } from '@nestjs/common'
import { CreateGoodDto } from './dto/create-good.dto'
import { UpdateGoodDto } from './dto/update-good.dto'
import { EntityManager, EntityRepository } from '@mikro-orm/core'
import { Good } from './entities/good.entity'
import { Image } from './entities/image.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { GoodsStatus, GoodsQuality } from '@campus/types'
import type { GoodFilterGet, GoodAudit } from '@campus/types'

@Injectable()
export class GoodsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Good)
    private readonly goodRepository: EntityRepository<Good>,
    @InjectRepository(Image)
    private readonly imageRepository: EntityRepository<Image>
  ) {}

  /**
   * 发布商品（小程序端调用）
   */
  async create(createGoodDto: CreateGoodDto, userId: number) {
    const { images, ...goods } = createGoodDto
    await this.em.transactional(async (em) => {
      const good = em.create(Good, {
        userId,
        title: goods.title,
        desc: goods.desc,
        price: goods.price,
        quality: goods.quality as GoodsQuality,
        categoryId: goods.categoryId,
        isAnonymous: goods.isAnonymous ?? false,
        place: goods.place,
      })
      em.persist(good)
      await em.flush()

      const imageList = await Promise.all(
        images.map((imageUrl) =>
          em.create(Image, {
            goodsId: good.id,
            imageUrl,
            isMain: false,
          })
        )
      )
      em.persist(imageList)
      await em.flush()

      return { good, imageList }
    })
  }

  /**
   * 管理端：分页查询商品列表
   */
  async findAll(query: GoodFilterGet): Promise<any> {
    const { page, pageSize, title, status, categoryId, startDate, endDate } = query

    const where: any = {}

    if (title) {
      where.title = { $ilike: `%${title}%` }
    }
    if (status) {
      where.status = status
    }
    if (categoryId) {
      where.categoryId = categoryId
    }
    if (startDate || endDate) {
      where.createAt = {}
      if (startDate) {
        where.createAt.$gte = new Date(startDate)
      }
      if (endDate) {
        // 截止日期包含当天
        const end = new Date(endDate)
        end.setDate(end.getDate() + 1)
        where.createAt.$lt = end
      }
    }

    const [list, total] = await this.goodRepository.findAndCount(where, {
      // createAt 相同时（种子数据批量插入同一时间戳）用 id 兜底，保证分页顺序稳定、不重复
      orderBy: { createAt: 'DESC', id: 'DESC' },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })

    // 查询每件商品的图片
    const goodIds = list.map((g) => g.id)
    const images = goodIds.length
      ? await this.imageRepository.find({ goodsId: { $in: goodIds } })
      : []

    const imageMap = new Map<number, typeof images>()
    images.forEach((img) => {
      const arr = imageMap.get(img.goodsId) || []
      arr.push(img)
      imageMap.set(img.goodsId, arr)
    })

    const result = list.map((good) => ({
      ...good,
      images: imageMap.get(good.id) || [],
    }))

    return {
      list: result,
      total,
      page,
      pageSize,
    }
  }

  /**
   * 查询单个商品详情（含图片）
   */
  async findOne(id: number): Promise<any> {
    const good = await this.goodRepository.findOneOrFail(id)
    const images = await this.imageRepository.find({ goodsId: id })
    return { ...good, images }
  }

  /**
   * 管理端：更新商品信息
   */
  async update(id: number, dto: UpdateGoodDto) {
    const updateData: any = { ...dto }
    if (dto.quality) {
      updateData.quality = dto.quality as GoodsQuality
    }
    await this.goodRepository.nativeUpdate({ id }, updateData)
    return { id, ...dto }
  }

  /**
   * 管理端：删除商品（级联删除图片）
   */
  async remove(id: number) {
    await this.em.transactional(async (em) => {
      await em.nativeDelete(Image, { goodsId: id })
      await em.nativeDelete(Good, { id })
    })
    return { id }
  }

  /**
   * 审核商品（通过/驳回）
   */
  async audit(id: number, dto: GoodAudit) {
    const updateData: any = { status: dto.status }
    if (dto.status === 'rejected' && dto.rejectReason) {
      updateData.rejectReason = dto.rejectReason
    } else if (dto.status === 'approved') {
      updateData.rejectReason = null
    }
    await this.goodRepository.nativeUpdate({ id }, updateData)
    return { id, ...updateData }
  }
}
