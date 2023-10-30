import { UseGuards } from '@nestjs/common'
import {
  BypassAuth,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { CourseService } from './course.service'
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { CourseResponse } from './dto/courseResponse'
import { CourseDetailsResponse } from './dto/courseDetailsResponse'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('Course')
@Controller({
  path: 'courses',
  version: ['1'],
})
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @BypassAuth()
  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    description:
      'Limits the number of results in a request. The server should have a default value for this field.',
  })
  @ApiQuery({
    name: 'before',
    required: false,
    description:
      'The client provides the value of startCursor from the previous response pageInfo to query the previous page of limit number of data items.',
  })
  @ApiQuery({
    name: 'after',
    required: false,
    description:
      'The client provides the value of endCursor from the previous response to query the next page of limit number of data items.',
  })
  @ApiQuery({
    name: 'programId',
    required: false,
    description: 'Program ID',
  })
  @ApiQuery({
    name: 'programMinorId',
    required: false,
    description: 'Program minor ID',
  })
  @ApiQuery({
    name: 'universityId',
    required: false,
    description: 'University ID',
  })
  @ApiOkResponse({
    type: CourseResponse,
    description: 'Returns all courses for the selected filtering',
  })
  @ApiOperation({
    summary: 'Get all courses',
  })
  getCourses(
    @Query('limit') limit: number,
    @Query('before') before: string,
    @Query('after') after: string,
    @Query('programId') programId: string,
    @Query('programMinorId') programMinorId: string,
    @Query('universityId') universityId: string,
  ): Promise<CourseResponse> {
    return this.courseService.getCourses(
      limit,
      after,
      before,
      programId,
      programMinorId,
      universityId,
    )
  }

  @BypassAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Course ID',
  })
  @ApiOkResponse({
    type: CourseDetailsResponse,
    description: 'Returns the course by ID',
  })
  @ApiOperation({
    summary: 'Get course by ID',
  })
  getCourseDetails(@Param('id') id: string): Promise<CourseDetailsResponse> {
    return this.courseService.getCourseDetails(id)
  }
}
