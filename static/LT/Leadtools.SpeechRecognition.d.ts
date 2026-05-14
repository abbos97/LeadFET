/**************************************************
Copyright (c) 1991-2026 Apryse Software Corp. ALL RIGHTS RESERVED.
This software is protected by United States and International copyright laws.
Any copying, duplication, deployment, redistribution, modification or other
disposition hereof is STRICTLY PROHIBITED without an express written license
granted by Apryse Software Corp. Specifically, no portion of this file may be modified, 
altered or otherwise changed under any circumstances, nor may any portion of this file be 
merged with any other file(s) or code.
Portions of this product are licensed under US patent 5,327,254 and foreign
counterparts.
For more information, contact Apryse Software Corp. at 704-332-5532 or visit
https://www.leadtools.com
**************************************************/
// Leadtools.SpeechRecognition.d.ts
// Version:23.0.0.1
declare module lt.SpeechRecognition {
    class SpeechRecognitionWord {
        private _value;
        value: string;
    }
    class SpeechRecognitionResult {
        private _words;
        readonly words: Array<SpeechRecognitionWord>;
        constructor();
        getText(): string;
    }
    enum SpeechRecognitionEngineState {
        started = 0,
        stopped = 1
    }
    class StateChangedEventArgs extends lt.LeadEventArgs {
        constructor(reason: string, state: SpeechRecognitionEngineState);
        readonly reason: string;
        readonly state: SpeechRecognitionEngineState;
    }
    interface StateChangedEventHandler extends lt.LeadEventHandler {
        (sender: any, e: StateChangedEventArgs): void;
    }
    class StateChangedEventType extends lt.LeadEvent {
        add(value: StateChangedEventHandler): StateChangedEventHandler;
        remove(value: StateChangedEventHandler): void;
    }
    class SpeechRecognizedEventArgs extends lt.LeadEventArgs {
        constructor(result: SpeechRecognitionResult, isFinal: boolean);
        readonly result: SpeechRecognitionResult;
        readonly isFinal: boolean;
    }
    interface SpeechRecognizedEventHandler extends lt.LeadEventHandler {
        (sender: any, e: SpeechRecognizedEventArgs): void;
    }
    class SpeechRecognizedEventType extends lt.LeadEvent {
        add(value: SpeechRecognizedEventHandler): SpeechRecognizedEventHandler;
        remove(value: SpeechRecognizedEventHandler): void;
    }
    class SpeechRecognitionEngine {
        readonly stateChanged: StateChangedEventType;
        readonly speechRecognized: SpeechRecognizedEventType;
        private asrModel;
        private static sampleRate;
        private channel;
        private recognizer;
        private recognizerProcessor;
        private source;
        private audioContext;
        private reportedSilenteResultsTime;
        private isFirefoxPrivateMode;
        private isFirefoxPrivateModeChecked;
        private modelUrl;
        constructor();
        static createEngine(url: string): SpeechRecognitionEngine;
        private lastPartialResults;
        private init;
        private isWorking;
        start(): void;
        stop(): void;
        readonly isStarted: boolean;
    }
}
