import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

// enums
import { SessionsThunkEnum } from '@extension/enums';

// servcies
import { SessionService } from '@extension/services';

// types
import { ILogger } from '@common/types';
import { IMainRootState, ISession } from '@extension/types';

const setSessionThunk: AsyncThunk<
  ISession, // return
  ISession, // args
  Record<string, never>
> = createAsyncThunk<ISession, ISession, { state: IMainRootState }>(
  SessionsThunkEnum.SetSession,
  async (session, { getState }) => {
    const logger: ILogger = getState().system.logger;
    const sessionService: SessionService = new SessionService({
      logger,
    });

    logger.debug(
      `${SessionsThunkEnum.SetSession}: saving session "${session.id}" to storage`
    );

    return await sessionService.save(session);
  }
);

export default setSessionThunk;
