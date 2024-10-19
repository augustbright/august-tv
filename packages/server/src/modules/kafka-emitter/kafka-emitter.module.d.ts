import { DynamicModule } from "@nestjs/common";
export declare class KafkaEmitterModule {
    static forRoot({ clientId, groupId, }: {
        clientId: string;
        groupId: string;
    }): DynamicModule;
}
