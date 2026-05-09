import { Get, Param, UseBefore } from 'routing-controllers';

import EntityController from '../common/entity-controller';
import BaseController from '../common/base-controller';
import internalAuthMiddleware from '../middlewares/internal-auth.middleware';
import { ensureFound } from '../common/http-errors';
import { Application } from '../models/application.entity';

@EntityController({
    baseRoute: '/internal/v1',
    entity: Application,
})
class InternalApplicationController extends BaseController {
    @Get('/applications/:application_id')
    @UseBefore(internalAuthMiddleware)
    async getApplication(@Param('application_id') applicationId: string) {
        return ensureFound(
            await this.repository.findOneBy({ id: applicationId }),
            'Application not found',
        );
    }

    @Get('/vacancies/:vacancy_id/applications/count')
    @UseBefore(internalAuthMiddleware)
    async countVacancyApplications(@Param('vacancy_id') vacancyId: string) {
        return {
            vacancy_id: vacancyId,
            count: await this.repository.countBy({ vacancyId }),
        };
    }

    @Get('/users/:user_id/applications')
    @UseBefore(internalAuthMiddleware)
    async listUserApplications(@Param('user_id') userId: string) {
        return {
            items: await this.repository.find({
                where: { userId },
                order: { createdAt: 'DESC' },
            }),
        };
    }
}

export default InternalApplicationController;
