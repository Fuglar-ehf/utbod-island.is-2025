import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Course } from './model/course'
import { University } from '../university/model/university'
import { ProgramCourse } from '../program/model/programCourse'
import { Program } from '../program/model/program'
import { ReykjavikUniversityApplicationClient } from '@island.is/clients/university-application/reykjavik-university'
import { UniversityOfIcelandApplicationClient } from '@island.is/clients/university-application/university-of-iceland'
import { UniversityOfAkureyriApplicationClient } from '@island.is/clients/university-application/university-of-akureyri'
import { IcelandUniversityOfTheArtsApplicationClient } from '@island.is/clients/university-application/iceland-university-of-the-arts'
import { AgriculturalUniversityOfIcelandApplicationClient } from '@island.is/clients/university-application/agricultural-university-of-iceland'
import { HolarUniversityApplicationClient } from '@island.is/clients/university-application/holar-university'
import { ICourse, UniversityNationalIds } from '@island.is/university-gateway'
import { logger } from '@island.is/logging'
import { Op } from 'sequelize'

@Injectable()
export class InternalCourseService {
  constructor(
    private readonly reykjavikUniversityClient: ReykjavikUniversityApplicationClient,
    private readonly universityOfIcelandClient: UniversityOfIcelandApplicationClient,
    private readonly universityOfAkureyriClient: UniversityOfAkureyriApplicationClient,
    private readonly icelandUniversityOfTheArtsClient: IcelandUniversityOfTheArtsApplicationClient,
    private readonly agriculturalUniversityOfIcelandClient: AgriculturalUniversityOfIcelandApplicationClient,
    private readonly holarUniversityClient: HolarUniversityApplicationClient,

    @InjectModel(University)
    private universityModel: typeof University,

    @InjectModel(Course)
    private courseModel: typeof Course,

    @InjectModel(Program)
    private programModel: typeof Program,

    @InjectModel(ProgramCourse)
    private programCourseModel: typeof ProgramCourse,
  ) {}

  async updateCourses(): Promise<void> {
    Promise.allSettled([
      this.doUpdateCoursesForUniversity(
        UniversityNationalIds.REYKJAVIK_UNIVERSITY,
        (externalId: string) =>
          this.reykjavikUniversityClient.getCourses(externalId),
      ),
      this.doUpdateCoursesForUniversity(
        UniversityNationalIds.UNIVERSITY_OF_ICELAND,
        (externalId: string) =>
          this.universityOfIcelandClient.getCourses(externalId),
      ),
      this.doUpdateCoursesForUniversity(
        UniversityNationalIds.UNIVERSITY_OF_AKUREYRI,
        (externalId: string) =>
          this.universityOfAkureyriClient.getCourses(externalId),
      ),
      this.doUpdateCoursesForUniversity(
        UniversityNationalIds.ICELAND_UNIVERSITY_OF_THE_ARTS,
        (externalId: string) =>
          this.icelandUniversityOfTheArtsClient.getCourses(externalId),
      ),
      this.doUpdateCoursesForUniversity(
        UniversityNationalIds.AGRICULTURAL_UNIVERSITY_OF_ICELAND,
        (externalId: string) =>
          this.agriculturalUniversityOfIcelandClient.getCourses(externalId),
      ),
      this.doUpdateCoursesForUniversity(
        UniversityNationalIds.HOLAR_UNIVERSITY,
        (externalId: string) =>
          this.holarUniversityClient.getCourses(externalId),
      ),
    ]).catch((e) => {
      logger.error('Failed to update courses, reason:', e)
    })
  }

  private async doUpdateCoursesForUniversity(
    universityNationalId: string,
    getCourses: (externalId: string) => Promise<ICourse[]>,
  ): Promise<void> {
    const universityId = (
      await this.universityModel.findOne({
        attributes: ['id'],
        where: { nationalId: universityNationalId },
      })
    )?.id

    if (!universityId) {
      throw new Error(
        `University with national id ${universityNationalId} not found in DB`,
      )
    }

    logger.info(
      `Started updating courses for university ${universityNationalId}`,
    )

    // Keep list of courses that are active
    const activeCourseIdList: string[] = []

    const programList = await this.programModel.findAll({
      attributes: ['id', 'externalId'],
      where: { universityId },
    })
    for (let i = 0; i < programList.length; i++) {
      const program = programList[i]
      const programId = program.id

      try {
        const courseList = await getCourses(program.externalId)

        for (let j = 0; j < courseList.length; j++) {
          const course = courseList[j]

          try {
            // Map to courseModel object
            const courseObj = {
              ...course,
              universityId,
            }

            // 1. UPSERT course
            const oldCourseObj = await this.courseModel.findOne({
              attributes: ['id'],
              where: { externalId: courseObj.externalId },
            })
            const [{ id: courseId }] = await this.courseModel.upsert({
              ...courseObj,
              id: oldCourseObj?.id,
            })

            // Map to programCourseModel object
            const programCourseObj = {
              ...course,
              programId,
              courseId,
            }

            // 2. UPSERT program course
            const oldProgramCourseObj = await this.programCourseModel.findOne({
              attributes: ['id'],
              where: { programId, courseId },
            })
            await this.programCourseModel.upsert({
              ...programCourseObj,
              id: oldProgramCourseObj?.id,
            })

            activeCourseIdList.push(courseId)
          } catch (e) {
            logger.error(
              `Failed to update course with externalId ${course.externalId} for program with externalId ${program.externalId}, reason:`,
              e,
            )
          }
        }
      } catch (e) {
        logger.error(
          `Failed to update courses for program with externalId ${program.externalId}, reason:`,
          e,
        )
      }
    }

    // 3. DELETE all courses for this university that are not being used
    // Note: this should also delete all necessary program course items since we have set onDelete=CASCADE
    await this.courseModel.destroy({
      where: {
        universityId,
        id: { [Op.notIn]: activeCourseIdList },
      },
    })

    logger.info(
      `Finished updating courses for university ${universityNationalId}`,
    )
  }
}
