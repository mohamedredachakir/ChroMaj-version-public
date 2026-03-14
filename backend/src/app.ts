import 'express-async-errors'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { ZodError } from 'zod'
import { env } from './config/env.js'
import { router } from './routes/index.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    }),
  )
  app.use(morgan('dev'))
  app.use(express.json())

  app.get('/', (_request, response) => {
    response.json({
      name: 'chromag-api',
      status: 'running',
      api: '/api',
    })
  })

  app.use('/api', router)

  app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
    if (error instanceof ZodError) {
      return response.status(400).json({
        message: 'Validation failed.',
        issues: error.issues,
      })
    }

    console.error(error)

    return response.status(500).json({
      message: 'Internal server error.',
    })
  })

  return app
}
