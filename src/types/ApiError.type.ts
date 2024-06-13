export default interface ApiError {
    error: {
      status: number
      data: any
    }
    isUnhandledError: boolean
    meta: {
      request: any
      response: any
    }
  }
  