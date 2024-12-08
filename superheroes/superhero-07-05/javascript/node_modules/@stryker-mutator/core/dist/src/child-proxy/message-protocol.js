export var WorkerMessageKind;
(function (WorkerMessageKind) {
    WorkerMessageKind[WorkerMessageKind["Init"] = 0] = "Init";
    WorkerMessageKind[WorkerMessageKind["Call"] = 1] = "Call";
    WorkerMessageKind[WorkerMessageKind["Dispose"] = 2] = "Dispose";
})(WorkerMessageKind || (WorkerMessageKind = {}));
export var ParentMessageKind;
(function (ParentMessageKind) {
    /**
     * Indicates that the child process is spawned and ready to receive messages
     */
    ParentMessageKind[ParentMessageKind["Ready"] = 0] = "Ready";
    /**
     * Indicates that initialization is done
     */
    ParentMessageKind[ParentMessageKind["Initialized"] = 1] = "Initialized";
    /**
     * Indicates an error happened during initialization
     */
    ParentMessageKind[ParentMessageKind["InitError"] = 2] = "InitError";
    /**
     * Indicates that a 'Call' was successful
     */
    ParentMessageKind[ParentMessageKind["CallResult"] = 3] = "CallResult";
    /**
     * Indicates that a 'Call' was rejected
     */
    ParentMessageKind[ParentMessageKind["CallRejection"] = 4] = "CallRejection";
    /**
     * Indicates that a 'Dispose' was completed
     */
    ParentMessageKind[ParentMessageKind["DisposeCompleted"] = 5] = "DisposeCompleted";
})(ParentMessageKind || (ParentMessageKind = {}));
//# sourceMappingURL=message-protocol.js.map