import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { KafkaPayloads, KafkaTopics } from "../../kafka";

@Injectable()
export class KafkaEmitterService {
    constructor(
        @Inject("KAFKA_CLIENT") private readonly kafkaClient: ClientKafka
    ) {}

    async onModuleInit() {
        await this.kafkaClient.connect();
    }

    emit<T extends KafkaTopics>(topic: T, payload: KafkaPayloads[T]) {
        return this.kafkaClient.emit(topic, JSON.stringify(payload));
    }

    static readonly topics = KafkaTopics;
}
