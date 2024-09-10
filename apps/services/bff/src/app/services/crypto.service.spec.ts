import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Test, TestingModule } from '@nestjs/testing'
import { BffConfig } from '../bff.config'
import { CryptoService } from './crypto.service'

const DECRYPTED_TEXT = 'Hello, World!'
const ENCRYPTED_TEXT = 'bW9ja2VkZGl'

// Mock the crypto module
jest.mock('crypto', () => {
  const actualCrypto = jest.requireActual('crypto')

  return {
    ...actualCrypto,
    createCipheriv: jest.fn(() => ({
      update: jest.fn().mockReturnValue(ENCRYPTED_TEXT),
      final: jest.fn().mockReturnValue(''),
    })),
    createDecipheriv: jest.fn(() => ({
      update: jest.fn().mockReturnValue(DECRYPTED_TEXT),
      final: jest.fn().mockReturnValue(''),
    })),
  }
})

const mockLogger = {
  error: jest.fn(),
} as unknown as Logger

const invalidConfig = {
  tokenSecretBase64: 'shortkey',
}

const validConfig = {
  // A valid 32-byte base64 key
  tokenSecretBase64: 'ABHlmq6Ic6Ihip4OnTa1MeUXtHFex8IT/mFZrjhsme0=',
}

const createModule = async (
  config: Record<string, string>,
): Promise<TestingModule> => {
  return Test.createTestingModule({
    providers: [
      CryptoService,
      { provide: LOGGER_PROVIDER, useValue: mockLogger },
      { provide: BffConfig.KEY, useValue: config },
    ],
  }).compile()
}

describe('CryptoService Constructor', () => {
  it('should throw an error if "tokenSecretBase64" is not 32 bytes long', async () => {
    try {
      const module = await createModule(invalidConfig)
      module.get<CryptoService>(CryptoService)
      // Fail the test if no error is thrown
      fail('Expected constructor to throw an error, but it did not.')
    } catch (error) {
      expect(error.message).toBe(
        '"tokenSecretBase64" secret must be exactly 32 bytes (256 bits) long.',
      )
    }
  })

  it('should not throw an error if "tokenSecretBase64" is 32 bytes long', async () => {
    try {
      const module = await createModule(validConfig)
      module.get<CryptoService>(CryptoService)
      // No error means the test passes
    } catch (error) {
      fail(`Expected no error, but received: ${error.message}`)
    }
  })
})

describe('CryptoService', () => {
  let service: CryptoService

  beforeEach(async () => {
    const module = await createModule(validConfig)
    service = module.get<CryptoService>(CryptoService)
  })

  describe('encrypt', () => {
    it('should encrypt and return a string containing IV and encrypted text', () => {
      const encryptedText = service.encrypt(DECRYPTED_TEXT)
      const [ivBase64, encrypted] = encryptedText.split(':')

      // Verify the length of the IV and the encrypted part
      // IV in base64 (16 bytes) should be 24 characters long
      expect(ivBase64).toHaveLength(24)
      expect(encrypted.length).toBeGreaterThan(0)
    })
  })

  describe('decrypt', () => {
    it('should decrypt an encrypted string and return the original text', () => {
      const encryptedText = service.encrypt(DECRYPTED_TEXT)
      const decryptedText = service.decrypt(encryptedText)

      expect(decryptedText).toBe(DECRYPTED_TEXT)
    })
  })
})
