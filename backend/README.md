# Google Sheets 연동 방법

GitHub Pages는 정적 사이트라 자체 DB를 가질 수 없습니다.  
가장 쉬운 방식은 Google Apps Script를 백엔드처럼 사용하는 것입니다.

## 1. 스프레드시트 만들기

1. Google Drive 접속
2. `새로 만들기`
3. `Google Sheets`
4. 문서 이름 예: `fortune_ai_responses`

## 2. Apps Script 열기

1. 스프레드시트 상단 메뉴에서 `확장 프로그램`
2. `Apps Script`
3. 기본 코드를 전부 삭제
4. ZIP 안의 `backend/google-apps-script.js` 내용을 붙여넣기
5. 저장

## 3. 웹 앱으로 배포

1. Apps Script 오른쪽 위 `배포`
2. `새 배포`
3. 유형 선택에서 `웹 앱`
4. 설명: `fortune ai backend`
5. 실행 사용자: `나`
6. 액세스 권한: `모든 사용자`
7. `배포`
8. Google 권한 승인
9. 배포 후 나오는 Web App URL 복사

형태는 보통 아래처럼 생겼습니다.

```text
https://script.google.com/macros/s/XXXXXXXXXXXX/exec
```

## 4. 사이트에 URL 넣기

`app.js` 상단에서 아래 줄을 찾습니다.

```js
const SHEET_ENDPOINT="";
```

복사한 URL을 넣습니다.

```js
const SHEET_ENDPOINT="https://script.google.com/macros/s/XXXXXXXXXXXX/exec";
```

저장 후 GitHub에 다시 업로드하면 됩니다.

## 5. 저장 테스트

1. GitHub Pages 사이트 접속
2. PIN 입력
3. 개인정보 동의 체크
4. 생년월일 입력
5. 아무 분석 결과 열기
6. 스프레드시트에 `responses` 시트가 자동 생성되고 행이 추가되는지 확인

## 6. 저장 항목

- timestamp
- name
- birth
- time
- gender
- calendar
- concern
- partnerName
- partnerBirth
- families
- reportType
- userAgent

## 중요 개인정보 안내

생년월일은 개인정보입니다.  
실제 운영 시 아래 내용을 별도로 명시하는 것이 좋습니다.

```text
입력하신 정보는 운세 리포트 제공 및 이용 기록 관리를 위해 저장됩니다.
보관 기간은 운영 목적 달성 후 최대 12개월이며,
삭제 요청은 관리자에게 문의하실 수 있습니다.
```
