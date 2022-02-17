import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { RegulationsService } from '@island.is/clients/regulations'
import { CreateDraftRegulationDto, UpdateDraftRegulationDto } from './dto'
import { DraftRegulationModel } from './draft_regulation.model'
import { DraftRegulationChangeModel } from '../draft_regulation_change'
import { DraftRegulationCancelModel } from '../draft_regulation_cancel'
import { Op } from 'sequelize'
import { DraftRegulationCancelService } from '../draft_regulation_cancel/draft_regulation_cancel.service'
import { DraftRegulationChangeService } from '../draft_regulation_change/draft_regulation_change.service'
import { DraftAuthorService } from '../draft_author/draft_author.service'
import {
  Author,
  DraftingStatus,
  DraftRegulationCancel,
  DraftRegulationCancelId,
  DraftRegulationChange,
  DraftRegulationChangeId,
  DraftSummary,
  RegulationDraft,
  RegulationDraftId,
} from '@island.is/regulations/admin'
import { Kennitala } from '@island.is/regulations'
import * as kennitala from 'kennitala'
import { NationalRegistryApi } from '@island.is/clients/national-registry-v1'
import type { User } from '@island.is/auth-nest-tools'

@Injectable()
export class DraftRegulationService {
  constructor(
    @InjectModel(DraftRegulationModel)
    private readonly draftRegulationModel: typeof DraftRegulationModel,
    private readonly draftRegulationCancelService: DraftRegulationCancelService,
    private readonly draftRegulationChangeService: DraftRegulationChangeService,
    private readonly draftAuthorService: DraftAuthorService,
    private readonly regulationsService: RegulationsService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    private readonly nationalRegistryApi: NationalRegistryApi,
  ) {}

  async getAll(user?: User): Promise<DraftSummary[]> {
    this.logger.debug(
      'Getting all non shipped DraftRegulations, filtered by national id for non managers',
    )
    const authorsCondition = user?.nationalId && {
      authors: { [Op.contains]: [user.nationalId] },
    }

    const draftRegulations = await this.draftRegulationModel.findAll({
      where: {
        drafting_status: { [Op.in]: ['draft', 'proposal'] },
        ...authorsCondition,
      },
      order: [
        ['drafting_status', 'ASC'],
        ['created', 'DESC'],
      ],
    })

    const drafts: DraftSummary[] = []
    for await (const draft of draftRegulations) {
      const authors = await this.getAuthorsInfo(draft.authors)

      drafts.push({
        id: draft.id as RegulationDraftId,
        draftingStatus: draft.drafting_status as 'draft' | 'proposal',
        title: draft.title,
        idealPublishDate: draft.ideal_publish_date,
        authors,
      })
    }

    return drafts
  }

  async getAllShipped(): Promise<DraftSummary[]> {
    this.logger.debug('Getting all shipped/published DraftRegulations')

    const draftRegulations = await this.draftRegulationModel.findAll({
      where: {
        drafting_status: { [Op.in]: ['shipped', 'published'] },
      },
      order: [['created', 'DESC']],
    })

    const drafts: DraftSummary[] = []
    for await (const draft of draftRegulations) {
      drafts.push({
        id: draft.id as RegulationDraftId,
        draftingStatus: draft.drafting_status as 'draft' | 'proposal',
        title: draft.title,
        idealPublishDate: draft.ideal_publish_date,
        authors: [],
      })
    }

    return drafts
  }

  async findById(id: string): Promise<RegulationDraft | null> {
    this.logger.debug(`Finding DraftRegulation ${id}`)

    const draftRegulation = await this.draftRegulationModel.findOne({
      where: { id },
      include: [
        { model: DraftRegulationChangeModel },
        { model: DraftRegulationCancelModel },
      ],
    })

    if (!draftRegulation) {
      return null
    }

    const lawChapters =
      (draftRegulation.law_chapters?.length &&
        (await this.regulationsService.getRegulationsLawChapters(
          false,
          draftRegulation.law_chapters,
        ))) ||
      undefined

    const authors = await this.getAuthorsInfo(draftRegulation.authors)

    const impactNames =
      draftRegulation.changes?.map((change) => change.regulation) ?? []
    draftRegulation.cancels?.forEach(async (cancel) => {
      impactNames.push(cancel.regulation)
    })

    const impactOptions = await this.regulationsService.getRegulationOptionList(
      impactNames,
    )

    const impacts: (DraftRegulationCancel | DraftRegulationChange)[] = []
    draftRegulation.changes?.forEach(async (change) => {
      impactNames.push(change.regulation)
      impacts.push({
        id: change.id as DraftRegulationChangeId,
        type: 'amend',
        date: change.date,
        title: change.title,
        text: change.text,
        appendixes: change.appendixes || [],
        comments: change.comments || '',
        // About the impaced stofnreglugerð
        name: change.regulation, // primary-key reference to the stofnreglugerð
        regTitle:
          impactOptions.find((opt) => opt.name === change.regulation)?.title ??
          '', // helpful for human-readable display in the UI
      })
    })
    draftRegulation.cancels?.forEach(async (cancel) => {
      impactNames.push(cancel.regulation)
      impacts.push({
        id: cancel.id as DraftRegulationCancelId,
        type: 'repeal',
        date: cancel.date,
        // About the cancelled reglugerð
        name: cancel.regulation, // primary-key reference to the reglugerð
        regTitle:
          impactOptions.find((opt) => opt.name === cancel?.regulation)?.title ??
          '', // helpful for human-readable display in the UI
      })
    })

    return {
      id: draftRegulation.id as RegulationDraftId,
      draftingStatus: draftRegulation.drafting_status as DraftingStatus,
      title: draftRegulation.title,
      name: draftRegulation.name,
      text: draftRegulation.text,
      appendixes: draftRegulation.appendixes || [],
      comments: draftRegulation.comments || '',
      lawChapters,
      ministry: draftRegulation.ministry,
      authors,
      idealPublishDate: draftRegulation.ideal_publish_date, // TODO: Exclude original from response.
      draftingNotes: draftRegulation.drafting_notes, // TODO: Exclude original from response.
      impacts,
      type: draftRegulation.type,
      effectiveDate: draftRegulation.effective_date,
      signatureDate: draftRegulation.signature_date,
      signatureText: draftRegulation.signature_text || '',
      signedDocumentUrl: draftRegulation.signed_document_url,
      fastTrack: draftRegulation.fast_track,
    }
  }

  create(
    create: CreateDraftRegulationDto,
    user?: User,
  ): Promise<DraftRegulationModel> {
    this.logger.debug('Creating a new DraftRegulation')

    const createData: Partial<DraftRegulationModel> = {
      drafting_status: 'draft',
      title: '',
      text: '',
      drafting_notes: '',
      authors: [user?.nationalId as Kennitala],
    }

    return this.draftRegulationModel.create(createData)
  }

  async update(
    id: string,
    update: UpdateDraftRegulationDto,
    user?: User,
  ): Promise<{
    numberOfAffectedRows: number
    updatedDraftRegulation: DraftRegulationModel
  }> {
    this.logger.debug(`Updating DraftRegulation ${id}`)

    const nationalId = user?.nationalId as Kennitala

    if (update.authors && !update.authors.includes(nationalId)) {
      update.authors.push(nationalId)
    }

    const updateData: Partial<DraftRegulationModel> = {
      title: update.title,
      text: update.text,
      appendixes: update.appendixes,
      comments: update.comments,
      ministry: update.ministry,
      drafting_notes: update.draftingNotes,
      ideal_publish_date: update.idealPublishDate,
      law_chapters: update.lawChapters,
      signature_date: update.signatureDate,
      signature_text: update.signatureText,
      effective_date: update.effectiveDate,
      type: update.type,
      drafting_status: update.draftingStatus,
      signed_document_url: update.signedDocumentUrl,
      authors: update.authors,
      fast_track: update.fastTrack,
    }

    const [
      numberOfAffectedRows,
      [updatedDraftRegulation],
    ] = await this.draftRegulationModel.update(updateData, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedDraftRegulation }
  }

  async delete(id: string): Promise<number> {
    this.logger.debug(`Deleting DraftRegulation ${id}`)

    // destroy all draft regulation impacts
    await this.draftRegulationCancelService.deleteRegulationDraftCancels(id)
    await this.draftRegulationChangeService.deleteRegulationDraftChanges(id)

    return this.draftRegulationModel.destroy({
      where: {
        id,
      },
    })
  }

  async getAuthorsInfo(nationalIds: Kennitala[]): Promise<Author[]> {
    const authors: Author[] = []
    for await (const nationalId of nationalIds) {
      if (kennitala.isCompany(nationalId)) {
        continue
      }
      let author = await this.draftAuthorService.get(nationalId)

      if (!author) {
        try {
          const person = await this.nationalRegistryApi.getUser(nationalId)
          if (person) {
            author = {
              name: person.Fulltnafn,
              authorId: nationalId,
            }
            await this.draftAuthorService.create(author)
          }
        } catch (e) {
          this.logger.debug(`Unable to create author: ${e}`)
        }
      }

      authors.push(
        author
          ? author
          : {
              authorId: nationalId,
              name: nationalId,
            },
      )
    }

    return authors
  }
}
