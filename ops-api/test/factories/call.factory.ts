import type {
  Call,
  CallStatus,
  CallDirection,
  Transcript,
  CallSummary,
} from '@prisma/client';

export interface CreateCallOptions {
  id?: string;
  wardId?: string;
  roomName?: string | null;
  status?: CallStatus;
  direction?: CallDirection;
  startedAt?: Date | null;
  endedAt?: Date | null;
  durationSec?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTranscriptOptions {
  id?: string;
  callId?: string;
  speaker?: string;
  text?: string;
  timestamp?: Date;
  createdAt?: Date;
}

export interface CreateCallSummaryOptions {
  id?: string;
  callId?: string;
  summary?: string;
  mood?: string | null;
  healthStatus?: string | null;
  concerns?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

let callCounter = 0;
let transcriptCounter = 0;
let summaryCounter = 0;

export function createMockCall(options: CreateCallOptions = {}): Call {
  callCounter++;
  const now = new Date();

  return {
    id: options.id ?? `call-${callCounter}`,
    wardId: options.wardId ?? `ward-${callCounter}`,
    roomName: options.roomName ?? `room-${callCounter}`,
    status: options.status ?? 'PENDING',
    direction: options.direction ?? 'OUTBOUND',
    startedAt: options.startedAt ?? null,
    endedAt: options.endedAt ?? null,
    durationSec: options.durationSec ?? null,
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
  };
}

export function createMockTranscript(
  options: CreateTranscriptOptions = {},
): Transcript {
  transcriptCounter++;
  const now = new Date();

  return {
    id: options.id ?? `transcript-${transcriptCounter}`,
    callId: options.callId ?? `call-${transcriptCounter}`,
    speaker: options.speaker ?? 'agent',
    text: options.text ?? `테스트 발화 ${transcriptCounter}`,
    timestamp: options.timestamp ?? now,
    createdAt: options.createdAt ?? now,
  };
}

export function createMockCallSummary(
  options: CreateCallSummaryOptions = {},
): CallSummary {
  summaryCounter++;
  const now = new Date();

  return {
    id: options.id ?? `summary-${summaryCounter}`,
    callId: options.callId ?? `call-${summaryCounter}`,
    summary: options.summary ?? `통화 요약 ${summaryCounter}`,
    mood: options.mood ?? '좋음',
    healthStatus: options.healthStatus ?? '양호',
    concerns: options.concerns ?? [],
    createdAt: options.createdAt ?? now,
    updatedAt: options.updatedAt ?? now,
  };
}

export function resetCallCounters(): void {
  callCounter = 0;
  transcriptCounter = 0;
  summaryCounter = 0;
}
