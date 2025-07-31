import { IBcrypt } from "../interface/bcrypt.interface";
import * as bcrypt from 'bcrypt';

export class BcryptImpl implements IBcrypt {
    

    async hash(value: string): Promise<string> {
        if (value) {
            const salt = await  bcrypt.genSalt();
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