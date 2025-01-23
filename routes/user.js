import express from 'express'
import {getAllUsers,getOneUser,addOneUser,updateOneUser,deleteOneUser , login, logout} from '../controllers/user.js'

const router = express.Router()

router.get('/getall/:id',getAllUsers)

router.get('/:id',getOneUser)

router.post('/',addOneUser)

router.put('/:id',updateOneUser)

router.delete('/:id',deleteOneUser)

router.post('/login',login)

router.post('/logout',logout)

export default router;


