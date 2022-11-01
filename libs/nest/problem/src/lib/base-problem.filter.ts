import { ArgumentsHost, ExceptionFilter, Inject } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { Response } from 'express'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Problem, ProblemType } from '@island.is/shared/problem'

import { ProblemError } from './ProblemError'
import { PROBLEM_OPTIONS } from './problem.options'
import type { ProblemOptions } from './problem.options'

export abstract class BaseProblemFilter implements ExceptionFilter {
  private readonly logger: Logger

  constructor(
    @Inject(PROBLEM_OPTIONS)
    private readonly options: ProblemOptions,
    @Inject(LOGGER_PROVIDER) logger: Logger,
  ) {
    this.logger = logger.child({ context: 'ErrorFilter' })
  }

  catch(error: Error, host: ArgumentsHost) {
    const problem = (error as ProblemError).problem || this.getProblem(error)

    if (problem.status && problem.status >= 500) {
      this.logger.error(error)
    } else if (this.options.logAllErrors) {
      this.logger.info(error)
    }

    if ((host.getType() as string) === 'graphql') {
      this.catchGraphQLError(error, problem)
    } else {
      this.catchRestError(host, problem)
    }
  }

  catchGraphQLError(error: Error, problem: Problem) {
    if (error instanceof ApolloError) {
      error.extensions.problem = error.extensions.problem || problem
      throw error
    } else {
      throw new ApolloError(problem.title, problem.type, { problem })
    }
  }

  catchRestError(host: ArgumentsHost, problem: Problem) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(problem.status || 500)
    response.statusMessage = problem.title

    if (problem.type === ProblemType.HTTP_NO_CONTENT) {
      response.send()
    } else {
      response.setHeader('Content-Language', 'en')
      response.setHeader('Content-Type', 'application/problem+json')
      response.json(problem)
    }
  }

  abstract getProblem(error: Error): Problem
}
