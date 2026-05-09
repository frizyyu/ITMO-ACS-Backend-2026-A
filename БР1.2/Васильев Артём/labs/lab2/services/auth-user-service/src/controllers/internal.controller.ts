import { Get, Param, UseBefore } from 'routing-controllers';

import EntityController from '../common/entity-controller';
import BaseController from '../common/base-controller';
import internalAuthMiddleware from '../middlewares/internal-auth.middleware';
import { ensureFound } from '../common/http-errors';
import { serializeUser } from '../common/serializers';
import { User } from '../models/user.entity';

@EntityController({
    baseRoute: '/internal/v1/users',
    entity: User,
})
class InternalUserController extends BaseController {
    @Get('/:user_id')
    @UseBefore(internalAuthMiddleware)
    async getUser(@Param('user_id') userId: string) {
        const user = ensureFound(
            await this.repository.findOneBy({ id: userId }),
            'User not found',
        ) as User;

        return serializeUser(user);
    }
}

export default InternalUserController;
