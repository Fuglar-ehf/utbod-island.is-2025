import { S3 } from 'aws-sdk'

import { Injectable } from '@nestjs/common'

import { environment } from '../../../environments'
import { PresignedPost, SignedUrl } from './models'

@Injectable()
export class AwsS3Service {
  private readonly s3: S3

  constructor() {
    this.s3 = new S3({ region: environment.files.region })
  }

  createPresignedPost(key: string): Promise<PresignedPost> {
    return new Promise((resolve, reject) => {
      this.s3.createPresignedPost(
        {
          Bucket: environment.files.bucket,
          Expires: +environment.files.timeToLivePost, // convert to number with +
          Fields: {
            key,
            'content-type': '',
            'Content-Disposition': 'inline',
          },
        },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        },
      )
    })
  }

  getSignedUrl(key: string): Promise<SignedUrl> {
    return new Promise((resolve, reject) => {
      this.s3.getSignedUrl(
        'getObject',
        {
          Bucket: environment.files.bucket,
          Key: key,
          Expires: +environment.files.timeToLiveGet, // convert to number with +
        },
        (err, url) => {
          if (err) {
            reject(err)
          } else {
            resolve({ url })
          }
        },
      )
    })
  }

  deleteObject(key: string): Promise<boolean> {
    return this.s3
      .deleteObject({
        Bucket: environment.files.bucket,
        Key: key,
      })
      .promise()
      .then(
        () => true,
        () => false,
      )
  }

  objectExists(key: string): Promise<boolean> {
    return this.s3
      .headObject({
        Bucket: environment.files.bucket,
        Key: key,
      })
      .promise()
      .then(
        () => true,
        (err) => {
          // The error is either 404 Not Found or 403 Forbidden.
          // Normally, we would check if the error is 404 Not Found.
          // However, to avoid granting the service ListBucket permissions,
          // we also allow 403 Forbidden.
          return false
        },
      )
  }
}
