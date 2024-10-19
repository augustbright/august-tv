import { env } from "@august-tv/env";
import { DynamicModule, Module } from "@nestjs/common";
import { KafkaEmitterService } from "./kafka-emitter.service";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({})
export class KafkaEmitterModule {
    static forRoot({
        clientId,
        groupId,
    }: {
        clientId: string;
        groupId: string;
    }): DynamicModule {
        return {
            module: KafkaEmitterModule,
            imports: [
                ClientsModule.register([
                    {
                        name: "KAFKA_CLIENT",
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                brokers: [env.KAFKA_BROKER],
                                clientId,
                            },
                            consumer: {
                                groupId,
                            },
                        },
                    },
                ]),
            ],
            providers: [KafkaEmitterService],
            exports: [KafkaEmitterService],
        };
    }
}
