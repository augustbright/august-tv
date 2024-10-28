import { env } from "@august-tv/env";
import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
    private readonly transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASSWORD,
        },
    });

    async sendMail(mailOptions: nodemailer.SendMailOptions) {
        return this.transporter.sendMail(mailOptions);
    }
}
