import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException
} from '@nestjs/common'
import { Logger } from '@utils'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse()

    let httpException = exception as HttpException

    if (!(exception instanceof HttpException)) {
      httpException = new InternalServerErrorException(exception.message)

      // Log the exception
      this.logger.error(exception, exception.stack)
    }

    res.status(httpException.getStatus()).json(httpException.getResponse())
  }
}
