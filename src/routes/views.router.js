import { Router } from "express";

const router = new Router();

router.get('/',(request,response) => {
    response.render('index',{style:'styles'})
})

export default router