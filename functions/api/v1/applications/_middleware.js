// import { authMiddleware } from '~/functions/middleware/auth'
import { errorMiddleware } from '~/functions/middleware/error'
import { fillMiddleware } from '~/functions/middleware/fill'

export const onRequest = [errorMiddleware, fillMiddleware]
