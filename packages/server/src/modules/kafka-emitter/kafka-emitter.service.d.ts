import { ClientKafka } from "@nestjs/microservices";
import { KafkaPayloads, KafkaTopics } from "../../kafka";
export declare class KafkaEmitterService {
    private readonly kafkaClient;
    constructor(kafkaClient: ClientKafka);
    onModuleInit(): Promise<void>;
    emit<T extends KafkaTopics>(topic: T, payload: KafkaPayloads[T]): import("rxjs").Observable<any>;
    static readonly topics: typeof KafkaTopics;
}
