import { Get, Param, QueryParam, UseBefore } from 'routing-controllers';

import EntityController from '../common/entity-controller';
import BaseController from '../common/base-controller';
import dataSource from '../config/data-source';
import internalAuthMiddleware from '../middlewares/internal-auth.middleware';
import { ensureFound } from '../common/http-errors';
import { Company } from '../models/company.entity';
import { EmployerProfile } from '../models/employer-profile.entity';

@EntityController({
    baseRoute: '/internal/v1',
    entity: Company,
})
class InternalCompanyController extends BaseController {
    private employerProfileRepository =
        dataSource.getRepository(EmployerProfile);

    @Get('/companies/:company_id')
    @UseBefore(internalAuthMiddleware)
    async getCompany(@Param('company_id') companyId: string) {
        return ensureFound(
            await this.repository.findOneBy({ id: companyId }),
            'Company not found',
        );
    }

    @Get('/employer-profiles/:profile_id')
    @UseBefore(internalAuthMiddleware)
    async getEmployerProfile(@Param('profile_id') profileId: string) {
        return ensureFound(
            await this.employerProfileRepository.findOneBy({ id: profileId }),
            'Employer profile not found',
        );
    }

    @Get('/employer-profiles/:profile_id/ownership')
    @UseBefore(internalAuthMiddleware)
    async checkEmployerProfileOwnership(
        @Param('profile_id') profileId: string,
        @QueryParam('user_id') userId: string,
        @QueryParam('company_id') companyId?: string,
    ) {
        const profile = ensureFound(
            await this.employerProfileRepository.findOneBy({ id: profileId }),
            'Employer profile not found',
        ) as EmployerProfile;

        const owned =
            profile.userId === userId &&
            (!companyId || profile.companyId === companyId);

        return {
            owned,
            profile_id: profile.id,
            user_id: userId,
            company_id: profile.companyId,
        };
    }

    @Get('/employer-profiles/by-user/:user_id')
    @UseBefore(internalAuthMiddleware)
    async getEmployerProfileByUser(@Param('user_id') userId: string) {
        return ensureFound(
            await this.employerProfileRepository.findOneBy({ userId }),
            'Employer profile not found',
        );
    }
}

export default InternalCompanyController;
