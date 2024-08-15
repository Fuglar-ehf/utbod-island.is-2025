import { Injectable, NotFoundException } from '@nestjs/common'
import { Screen } from './models/screen.model'
import { InjectModel } from '@nestjs/sequelize'
import { CreateScreenDto } from './models/dto/createScreen.dto'
import { UpdateScreenDto } from './models/dto/updateScreen.dto'
import { ScreenDto } from './models/dto/screen.dto'
import { UpdateScreensDisplayOrderDto } from './models/dto/updateScreensDisplayOrder.dto'
import { defaults, pick, zipObject } from 'lodash'

@Injectable()
export class ScreensService {
  constructor(
    @InjectModel(Screen)
    private readonly screenModel: typeof Screen,
  ) {}

  async create(createScreenDto: CreateScreenDto): Promise<ScreenDto> {
    const screen = createScreenDto as Screen
    const newScreen: Screen = new this.screenModel(screen)
    await newScreen.save()

    const keys = ['id', 'sectionId']
    const screenDto: ScreenDto = defaults(
      pick(newScreen, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as ScreenDto

    return screenDto
  }

  async update(
    id: string,
    updateScreenDto: UpdateScreenDto,
  ): Promise<ScreenDto> {
    const screen = await this.screenModel.findByPk(id)

    if (!screen) {
      throw new NotFoundException(`Screen with id '${id}' not found`)
    }

    screen.name = updateScreenDto.name
    screen.multiset = updateScreenDto.multiset
    screen.callRuleset = updateScreenDto.callRuleset
    screen.modified = new Date()

    await screen.save()

    const keys = [
      'id',
      'sectionId',
      'name',
      'displayOrder',
      'isHidden',
      'multiset',
      'callRuleset',
    ]
    const screenDto: ScreenDto = defaults(
      pick(screen, keys),
      zipObject(keys, Array(keys.length).fill(null)),
    ) as ScreenDto

    return screenDto
  }

  async updateDisplayOrder(
    updateScreensDisplayOrderDto: UpdateScreensDisplayOrderDto,
  ): Promise<void> {
    const { screensDisplayOrderDto: screensDisplayOrderDto } =
      updateScreensDisplayOrderDto

    for (let i = 0; i < screensDisplayOrderDto.length; i++) {
      const screen = await this.screenModel.findByPk(
        screensDisplayOrderDto[i].id,
      )

      if (!screen) {
        throw new NotFoundException(
          `Screen with id '${screensDisplayOrderDto[i].id}' not found`,
        )
      }

      screen.update({
        displayOrder: i,
        sectionId: screensDisplayOrderDto[i].sectionId,
      })
    }
  }

  async delete(id: string): Promise<void> {
    const screen = await this.screenModel.findByPk(id)

    if (!screen) {
      throw new NotFoundException(`Screen with id '${id}' not found`)
    }

    screen.destroy()
  }
}
