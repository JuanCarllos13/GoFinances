import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import 'jest-fetch-mock'

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)