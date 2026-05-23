# Fortune Fate V7 Calendar Accurate

반영 내용:
- 음력 → 양력 변환 테이블 내장(1900~2049)
- 24절기 계산 공식 기반 월주/연주 경계 개선
- 고정일 절기 방식 제거
- 입력이 음력일 경우 자동으로 양력 변환 후 사주 계산
- 만세력 8글자 직접 입력 시 직접 입력값 우선
- 결과 카드형 + 이모티콘 + 장문 동적 결과 유지
- 스프레드시트 URL이 비어 있으면 화면 안내 없이 저장만 건너뜀
- Google Sheets 연동 예시 포함

주의:
브라우저 오프라인 내장 역법입니다. 절기 시각은 공식 기반 근사값이며, 실제 전문 감정/유료 운영에서는 외부 만세력과 교차 검증을 권장합니다.


## Google Sheets Web App URL 반영 완료

현재 app.js에 아래 새 배포 URL이 반영되어 있습니다.

```text
https://script.google.com/macros/s/AKfycbxtnSXuvyiovE87BQeHeMf46zqlfsEE-ILPTsj5CdmTqr2xgjd-c6zfqtvqIqnscdI/exec
```

결과 리포트를 열 때 입력 정보가 이 Apps Script URL로 전송됩니다.
