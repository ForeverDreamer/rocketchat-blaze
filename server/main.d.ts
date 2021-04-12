import { Db, Collection } from 'mongodb';

declare module 'meteor/mongo' {
    interface RemoteCollectionDriver {
        mongo: MongoConnection;
    }
    interface OplogHandle {
        stop(): void;
        onOplogEntry(trigger: Record<string, any>, callback: Function): void;
        onSkippedEntries(callback: Function): void;
        waitUntilCaughtUp(): void;
        _defineTooFarBehind(value: number): void;
    }
    interface MongoConnection {
        db: Db;
        _oplogHandle: OplogHandle;
        rawCollection(name: string): Collection;
    }

    namespace MongoInternals {
        function defaultRemoteCollectionDriver(): RemoteCollectionDriver;

        class ConnectionClass {}

        function Connection(): ConnectionClass;
    }
}
