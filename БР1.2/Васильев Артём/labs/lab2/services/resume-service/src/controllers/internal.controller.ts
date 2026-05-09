import { Get, Param, QueryParam, UseBefore } from 'routing-controllers';

import EntityController from '../common/entity-controller';
import BaseController from '../common/base-controller';
import internalAuthMiddleware from '../middlewares/internal-auth.middleware';
import { ensureFound } from '../common/http-errors';
import { Resume } from '../models/resume.entity';

@EntityController({
    baseRoute: '/internal/v1/resumes',
    entity: Resume,
})
class InternalResumeController extends BaseController {
    @Get('/:resume_id')
    @UseBefore(internalAuthMiddleware)
    async getResume(@Param('resume_id') resumeId: string) {
        return ensureFound(
            await this.repository.findOneBy({ id: resumeId }),
            'Resume not found',
        );
    }

    @Get('/:resume_id/ownership')
    @UseBefore(internalAuthMiddleware)
    async checkResumeOwnership(
        @Param('resume_id') resumeId: string,
        @QueryParam('user_id') userId: string,
    ) {
        const resume = ensureFound(
            await this.repository.findOneBy({ id: resumeId }),
            'Resume not found',
        ) as Resume;

        return {
            owned: resume.userId === userId,
            resume_id: resume.id,
            user_id: userId,
            is_published: resume.isPublished,
        };
    }

    @Get('/:resume_id/publication-status')
    @UseBefore(internalAuthMiddleware)
    async getResumePublicationStatus(@Param('resume_id') resumeId: string) {
        const resume = ensureFound(
            await this.repository.findOneBy({ id: resumeId }),
            'Resume not found',
        ) as Resume;

        return {
            resume_id: resume.id,
            is_published: resume.isPublished,
        };
    }
}

export default InternalResumeController;
