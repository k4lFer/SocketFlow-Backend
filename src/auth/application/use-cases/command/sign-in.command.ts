import { Command } from "@nestjs/cqrs";
import { Result } from "src/shared/response/result.impl";
import { SignInDto } from "../../dto/in/sign-in.dto";
import { Response } from "express";

export class SignInCommand extends Command<Result<any>> {
    constructor(
        public readonly input: SignInDto,
        public readonly res?: Response
    ) {
        super();
    }
}