# OPS 도메인 용어집

> 프로젝트에서 사용하는 핵심 도메인 용어 정의

---

## 사용자 관련

| 용어 | 영문 | 정의 | 코드 예시 |
|------|------|------|----------|
| 보호자 | Guardian | 어르신을 돌보는 가족/관리자 | `guardian_id`, `Guardian` entity |
| 피보호자 | Ward | 돌봄 대상 어르신 | `ward_id`, `Ward` entity |
| 관리자 | Admin | 관제 센터 직원 | `Admin` entity, `admin_` prefix |

---

## 통신 관련

| 용어 | 영문 | 정의 | 코드 예시 |
|------|------|------|----------|
| 통화방 | Room | LiveKit 화상통화 세션 | `room_name`, `Room` entity |
| 대화 인계 | Takeover | 관리자가 AI 대신 직접 대화 | `takeover_active`, `TakeoverHandler` |
| 음성 전사 | Transcript | 음성→텍스트 변환 결과 | `TranscriptHandler`, `transcript` |

---

## 알림 관련

| 용어 | 영문 | 정의 | 코드 예시 |
|------|------|------|----------|
| 케어 알림 | CareAlert | 어르신 상태 이상 알림 | `care_alert`, `CareAlertType` |
| 낙상 감지 | DeviceFall | 디바이스 낙상 감지 이벤트 | `device_fall` |
| VoIP 푸시 | VoIP Push | iOS 통화 푸시 알림 | `voip_token` |

---

## 에이전트 관련

| 용어 | 영문 | 정의 | 코드 예시 |
|------|------|------|----------|
| AI 동반자 | ElderlyCompanion | 어르신 돌봄 AI 에이전트 | `ElderlyCompanionAgent` |
| 인바운드 | Inbound | 어르신이 먼저 건 통화 | `call_direction: inbound` |
| 아웃바운드 | Outbound | 시스템이 먼저 건 통화 | `call_direction: outbound` |

---

## 데이터베이스 엔티티

| 엔티티 | 설명 | 주요 필드 |
|--------|------|----------|
| User | 사용자 기본 정보 | identity, user_type |
| Guardian | 보호자 프로필 | user_id, wards |
| Ward | 피보호자 프로필 | user_id, guardian_id |
| Device | 디바이스 정보 | apns_token, voip_token |
| Call | 통화 기록 | room_id, started_at, ended_at |
| CallSummary | 통화 요약 | call_id, summary, analysis |
| Room | 통화방 | room_name, status |
| Admin | 관리자 계정 | email, role |

---

## 상태 값

| 상태 | 영문 | 설명 |
|------|------|------|
| 활성 | active | 진행 중인 통화 |
| 위험 | danger | 주의 필요 상태 |
| 인계 중 | takeover | 관리자 대화 인계 상태 |
