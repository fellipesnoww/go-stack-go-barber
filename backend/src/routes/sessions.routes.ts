import {Router} from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService'
const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
    try {   
        const {email, password} = request.body;
        
        const authenticateUser = new AuthenticateUserService();

        await authenticateUser.execute({email, password});

        const {user, token} = await authenticateUser.execute({
            email,
            password
        });

        const model = {
            id: user.id,        
            name: user.name,    
            email,
            created_at: user.created_at,
            updated_at: user.updated_at,
            token
        }
        return response.json(model);
        
    } catch (error) {
        return response.status(400).json({message: error.message})
    }
});

export default sessionsRouter;