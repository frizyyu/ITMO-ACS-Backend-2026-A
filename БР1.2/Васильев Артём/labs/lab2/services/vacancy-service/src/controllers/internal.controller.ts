import { Get, Param, UseBefore } from 'routing-controllers';

import EntityController from '../common/entity-controller';
import BaseController from '../common/base-controller';
import internalAuthMiddleware from '../middlewares/internal-auth.middleware';
import { ensureFound } from '../common/http-errors';
import { Vacancy } from '../models/vacancy.entity';

@EntityController({
    baseRoute: '/internal/v1/vacancies',
    entity: Vacancy,
})
class InternalVacancyController extends BaseController {
    @Get('/:vacancy_id')
    @UseBefore(internalAuthMiddleware)
    async getVacancy(@Param('vacancy_id') vacancyId: string) {
        return ensureFound(
            await this.repository.findOneBy({ id: vacancyId }),
            'Vacancy not found',
        );
    }

    @Get('/:vacancy_id/owner')
    @UseBefore(internalAuthMiddleware)
    async getVacancyOwner(@Param('vacancy_id') vacancyId: string) {
        const vacancy = ensureFound(
            await this.repository.findOneBy({ id: vacancyId }),
            'Vacancy not found',
        ) as Vacancy;

        return {
            vacancy_id: vacancy.id,
            company_id: vacancy.companyId,
            employer_profile_id: vacancy.employerProfileId,
        };
    }

    @Get('/:vacancy_id/publication-status')
    @UseBefore(internalAuthMiddleware)
    async getVacancyPublicationStatus(@Param('vacancy_id') vacancyId: string) {
        const vacancy = ensureFound(
            await this.repository.findOneBy({ id: vacancyId }),
            'Vacancy not found',
        ) as Vacancy;

        return {
            vacancy_id: vacancy.id,
            is_published: vacancy.isPublished,
        };
    }
}

export default InternalVacancyController;
