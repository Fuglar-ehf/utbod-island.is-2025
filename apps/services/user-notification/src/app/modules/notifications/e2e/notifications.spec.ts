import request from 'supertest'
import { INestApplication, Injectable } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { NotificationsController } from '../notifications.controller'
import { CONFIG_PROVIDER } from '../../../../constants'
import { NotificationsWorkerService } from '../notificationsWorker.service'
import { Message, MessageTypes } from '../dto/createNotification.dto'
import { LoggingModule } from '@island.is/logging'
import {
  getQueueServiceToken,
  QueueModule,
  QueueService,
} from '@island.is/message-queue'
import { InjectWorker, WorkerService } from '@island.is/message-queue'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const environment = {
  mainQueueName: 'test-main',
  deadLetterQueueName: 'test-failure',
  sqsConfig: {
    endpoint: process.env.SQS_ENDPOINT,
    region: 'eu-west-1',
    credentials: {
      accessKeyId: 'testing',
      secretAccessKey: 'testing',
    },
  },
}

const waitForDelivery = async (
  worker: WorkerMock,
  cond: (messages: Message[]) => boolean,
  max = 1000,
): Promise<void> => {
  const start = Date.now()
  while (Date.now() <= start + max && !cond(worker.received)) {
    await sleep(10)
  }
}

@Injectable()
class WorkerMock {
  public received: Message[] = []

  constructor(@InjectWorker('notifications') private worker: WorkerService) {}

  async run() {
    this.worker.run(async (msg: Message) => {
      this.received.push(msg)
    })
  }
}

describe('Notifications API', () => {
  let app: INestApplication

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        LoggingModule,
        QueueModule.register({
          client: environment.sqsConfig,
          queue: {
            name: 'notifications',
            queueName: environment.mainQueueName,
          },
        }),
      ],
      controllers: [NotificationsController],
      providers: [
        {
          provide: CONFIG_PROVIDER,
          useValue: environment,
        },
        NotificationsWorkerService,
      ],
    })
      .overrideProvider(NotificationsWorkerService)
      .useClass(WorkerMock)
      .compile()

    app = await module.createNestApplication().init()
    await app.get<QueueService>(getQueueServiceToken('notifications')).purge()
    app.get(NotificationsWorkerService).run()
  })

  afterEach(async () => {
    await app.close()
  })

  it('Accepts a valid message input', async () => {
    const msg: Message = {
      type: MessageTypes.NewDocumentMessage,
      organization: 'Skatturinn',
      recipient: '0409084390',
      documentId: '123',
    }

    await request(app.getHttpServer())
      .post('/notifications')
      .send(msg)
      .expect(201)

    const worker = app.get(NotificationsWorkerService) as WorkerMock
    await waitForDelivery(worker, (msgs) => msgs.length > 0)
    expect(worker.received).toEqual([msg])
  })
})
