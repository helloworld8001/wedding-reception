# 지훈 · 지형 신랑 측 피로연 초대장

본식 청첩장과 별도로 관리하는 피로연 전용 모바일 초대장입니다.

- 공개 주소: https://jravvit.github.io/wedding-reception/
- 저장소: https://github.com/Jravvit/wedding-reception
- QR: `dist/assets/reception-qr.png`, `dist/assets/reception-qr.svg`
- 업데이트: 수정 커밋 후 `git push origin main`

## 행사 정보

- 신랑 전지훈 · 신부 유지형
- 신랑 혼주 전병채 · 채명심, 장남 지훈
- 2026년 12월 3일 목요일 오후 4시~7시 (한국 시간)
- 내츄럴팜
- 전북특별자치도 부안군 변산면 변산로 2427

연도는 2027년 1월 본식에 앞선 2026년 12월로 반영했습니다. 장소와 주소는 사용자 제공 정보이며, [부안군 공식 가맹점 안내](https://www.buan.go.kr/buanlove/board/view.do?boardId=BBS_0000261&dataSid=348743&menuCd=DOM_000002402003000000&paging=ok&startPage=1)에서도 확인했습니다. 주차·교통편·연회장 층수는 제공되지 않아 기재하지 않았습니다.

## 구성과 성능

아이보리·브라운 색상, 한글 명조체와 영문 세리프, 정중한 부모님 초대글, 사진 갤러리 6장, 캘린더 저장, 지도 연결, 주소 복사와 공유를 제공합니다.

외부 프레임워크 및 상시 실행 타이머가 없는 정적 사이트입니다. 메인 사진은 우선 로딩하고, 갤러리는 작은 미리보기를 지연 로딩합니다. 큰 사진은 눌렀을 때만 가져옵니다. 등장 효과는 1회만 실행하며, 기기의 동작 줄이기 설정을 따릅니다. 지도는 외부 서비스 링크로 연결해 지도 SDK의 초기 로딩 비용을 줄였습니다.

## 로컬 작업

```sh
npm run dev
```

http://localhost:4174 에서 확인합니다. 패키지 설치는 필요 없습니다. 본문은 `dist/index.html`, 디자인은 `dist/style.css`, 복사·공유·사진 확대는 `dist/app.js`, 일정은 `dist/reception.ics`입니다.

## 배포

GitHub Pages의 Source를 GitHub Actions로 설정합니다. `main`에 사이트 변경을 push하면 `.github/workflows/deploy-pages.yml`이 정적 파일을 배포합니다. 공유 미리보기 주소와 사진 URL은 실제 Pages 주소로 자동 반영합니다.

```sh
npm run build:pages -- https://jravvit.github.io/wedding-reception/
```

산출물은 `.artifacts/github-pages/`에 생성됩니다. QR 코드는 위 공개 주소로 연결됩니다. 주소가 바뀌면 QR도 다시 만들어야 합니다.
