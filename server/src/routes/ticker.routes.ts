import { Router, Request, Response } from 'express';

const router = Router();

router.get('/available', (req: Request, res: Response) => {
  res.json({
    message: "Global Live Sports Feed",
    pairs: [
        'NBA-12345', // You'd ideally get these IDs dynamically
        'SOCCER-67890'
    ]
  });
});

export default router;