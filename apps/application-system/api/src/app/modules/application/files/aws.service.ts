import { Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'

@Injectable()
export class AwsService {
  s3: AWS.S3

  constructor() {
    this.s3 = new AWS.S3()
  }

  async getFile(
    bucket: string,
    fileName: string,
  ): Promise<AWS.S3.GetObjectOutput> {
    const downloadParams = {
      Bucket: bucket,
      Key: fileName,
    }

    return await this.s3.getObject(downloadParams).promise()
  }

  async uploadFile(
    content: Buffer,
    bucket: string,
    fileName: string,
  ): Promise<void> {
    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      ContentEncoding: 'base64',
      ContentDisposition: 'inline',
      ContentType: 'application/pdf',
      Body: content,
    }

    await this.s3.upload(uploadParams).promise()
  }

  async getPresignedUrl(bucket: string, fileName: string): Promise<string> {
    const oneMinute = 60
    const presignedUrlParams = {
      Bucket: bucket,
      Key: fileName,
      Expires: oneMinute * 120, // TODO: Select length for presigned url's in island.is
    }

    return await this.s3.getSignedUrlPromise('getObject', presignedUrlParams)
  }
}
