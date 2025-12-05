import { Injectable } from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service'
import { Role } from '../common/enums/role.enums';

@Injectable()
export class UsersService {
    constructor(private prisma:PrismaService){}

    async findByEmail(email:string){
        return this.prisma.user.findUnique({
            where:{email},
        });
    }
    async createUser(data:{
        name:string;
        email:string,
        password:string,
        role?:Role;
    }){
        return this.prisma.user.create({
            data:{
                name:data.name,
                email:data.email,
                password:data.password,
                role:data.role??Role.USER,
            },
        });
    }
    async findById(id:string){
        return this.prisma.user.findUnique({
            where:{id},
        });
    }
}
