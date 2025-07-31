import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './infrastructure/schemas/chat.schema';
import { MessageSchema } from './infrastructure/schemas/message.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Chat', schema: ChatSchema },
            { name: 'Message', schema: MessageSchema },
        ]),
        JwtModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class ChatModule {}
