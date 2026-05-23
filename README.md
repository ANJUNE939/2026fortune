# Fortune Fate V10 TEST No Cache

테스트용 버전입니다.

## 핵심 변경
- 기존 서비스워커 캐시 자동 삭제
- 서비스워커 등록 제거
- `sw.js`는 캐시 삭제 후 자기 자신을 해제하는 cache-killer로 변경
- CSS/JS에 `?v=10.0.0` 캐시버스터 적용
- `.nojekyll` 포함
- V9의 신뢰도 강화/자극적 답변 로직 유지
- Google Sheets Web App URL 유지

## 친구 테스트 주소
업로드 후 아래처럼 접속하세요.

```text
https://anjune939.github.io/2026fortune/?v=10
```

친구들이 캐시 삭제를 하지 않아도 새 버전을 볼 가능성이 높아집니다.

## 주의
이미 예전 서비스워커가 너무 강하게 잡힌 기기에서는 첫 접속 후 한 번 더 새로고침하면 확실합니다.
