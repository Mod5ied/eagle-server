import { loginHandler, meHandler, logoutHandler } from '@controllers/auth.controller.js';
import { validateRequest } from '@middleware/validateRequest.js';
import { loginSchema } from '@schemas/auth.schema.js';
import { Router } from 'express';
import type { Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();
router.post('/login', validateRequest(loginSchema), loginHandler);
router.get('/me', meHandler);
router.post('/logout', logoutHandler);
export default router;
