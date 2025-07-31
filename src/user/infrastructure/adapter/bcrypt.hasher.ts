import { Injectable } from "@nestjs/common";
import { IPasswordHasher } from "src/user/domain/port/password-hasher.interface";
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHasher implements IPasswordHasher {
    async hash(value: string): Promise<string> {
        if (value) {
            const salt = await bcrypt.genSalt();
            return await bcrypt.hash(value, salt);
        }
        return "";
    }
    
    async compare(value: string, hash: string): Promise<boolean> {
        if (value && hash) {
            return await bcrypt.compare(value, hash);
        }
        return false;
    }
    
}