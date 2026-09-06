# web-startpack

Современная Gulp-сборка для многостраничной HTML-вёрстки и проектов с PHP-шаблонами.

## Требования

- Node.js 24.15.0 (LTS)
- npm 11+

Версии зафиксированы в `package.json` через Volta. Зависимости устанавливаются строго из `package-lock.json`:

```bash
npm ci
```

## Команды

```bash
npm start       # HTML-разработка и BrowserSync
npm run php     # PHP-разработка, требуется PHP_PROXY
npm run build   # чистая production-сборка
npm run check   # форматирование, линтеры, сборка и HTML-валидация
npm run deploy  # чистая сборка и загрузка по SFTP
```

Дополнительные проверки можно запускать отдельно:

```bash
npm run format:check  # проверка форматирования Prettier
npm run lint:js       # ESLint для Gulp-задач и клиентского JavaScript
npm run lint:css      # Stylelint для SCSS
npm run lint:html     # HTML Validate для собранных страниц
```

`npm run lint:html` проверяет файлы в `build`, поэтому перед отдельным запуском HTML-валидации сначала выполните `npm run build`.

Чтобы BrowserSync не открывал браузер автоматически:

```bash
BROWSER_SYNC_OPEN=false npm start
```

Для доступа из локальной сети установите `DEV_LISTEN=0.0.0.0`.

Для PHP укажите адрес локального backend:

```bash
PHP_PROXY=http://project.test npm run php
```

## Структура

```text
src/
├── components/       HTML, PHP, SCSS и JS компонентов
├── fonts/            WOFF/WOFF2 или исходные TTF
├── img/              растровые изображения, SVG, GIF и favicon
├── js/01_main.js     главная точка входа JavaScript
├── scss/style.scss   единственная точка входа Sass
├── svg/css/          SVG, преобразуемые в SCSS data URI
└── svg/sprite/       SVG-иконки symbol-спрайта

build/                результат сборки, кроме .gitkeep не хранится в Git
tasks/                задачи Gulp
ai/instructions/      подробные правила разработки для AI-ассистентов
```

## Соглашения по коду

- Один уровень вложенности равен четырём пробелам; табуляция не используется.
- Компоненты именуются по БЭМ: `block`, `block__element`, `block--modifier`.
- Состояния интерфейса обозначаются классами `is-*`, точки подключения JavaScript — атрибутами `data-*`.
- Разметка должна оставаться семантичной и доступной с клавиатуры. Нативные HTML-элементы имеют приоритет над ARIA.
- Повторяемые значения оформления задаются CSS-переменными; компоненты используют дизайн-токены вместо дублирования значений.
- Сторонние runtime-зависимости не добавляются без необходимости. Для каруселей и слайдеров используется Swiper.js.

Prettier проверяет форматирование исходного кода и конфигураций. Исходные HTML-шаблоны исключены из автоматического форматирования, чтобы сохранять принятый порядок и перенос атрибутов. Stylelint дополнительно проверяет БЭМ-совместимый формат классов.

## HTML-компоненты

Используется синтаксис `gulp-file-include`:

```html
@@include('components/page-blocks/_header.html')
```

HTML-файлы внутри `src/components` считаются partial-файлами и отдельно в `build` не копируются.

## Sass

Используется модульная система `@use`. Автоматические glob-импорты намеренно удалены: зависимость компонента должна быть видна в `src/scss/style.scss`.

```scss
@use "../components/bem-blocks/button/button";
```

Общие mixin подключаются внутри использующего их модуля:

```scss
@use "../../scss/base/mixins";
```

Целевые браузеры задаются полем `browserslist` в `package.json` и используются Autoprefixer.

## JavaScript

Исходный JavaScript организован как ESM-модули. `src/js/01_main.js` является точкой входа, а esbuild собирает локальные и разрешённые npm-импорты в изолированный браузерный IIFE-бандл.

Каждый DOM-модуль отвечает за одно поведение, ищет точку монтирования через `data-*` и безопасно завершается, если нужной разметки на странице нет. Глобальные переменные не создаются.

Development-сборка не минифицируется, production-сборка минифицируется; sourcemap создаётся в обоих режимах.

## Изображения и SVG

- PNG и JPEG оптимизируются Sharp; рядом создаются WebP и AVIF.
- SVG из `src/img` оптимизируются SVGO.
- Остальные файлы из `src/img` копируются без преобразования.
- `src/svg/sprite/*.svg` собираются в `build/img/sprite.svg`.
- `src/svg/css/*.svg` доступны как классы `.--svg__имя-файла`.

Результаты никогда не записываются обратно в `src`.

## Проверки и CI

Полная проверка выполняется командой `npm run check` в следующем порядке:

1. Prettier проверяет форматирование.
2. ESLint проверяет JavaScript.
3. Stylelint проверяет SCSS и формат БЭМ-классов.
4. Gulp создаёт чистую production-сборку.
5. HTML Validate проверяет итоговые HTML-страницы.

GitHub Actions запускает эту же команду при push в `main` и для pull request. Успешная автоматическая проверка не заменяет ручную проверку семантики, клавиатурной доступности, адаптивности и поведения интерфейса.

## Инструкции для AI-ассистентов

[AGENTS.md](AGENTS.md) — каноническая точка входа для Codex, OpenCode, DeepSeek, Claude, Gemini, GitHub Copilot и других AI-сред. Перед работой ассистент должен прочитать его и тематические документы:

- [разметка](ai/instructions/markup.md);
- [стили](ai/instructions/styles.md);
- [JavaScript](ai/instructions/scripts.md);
- [ресурсы и новые страницы](ai/instructions/assets.md);
- [качество и проверка](ai/instructions/quality.md).

Платформенные файлы `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md` и `opencode.json` являются только адаптерами к единому набору правил.

## Шрифты

- WOFF и WOFF2 копируются в `build/fonts`.
- TTF автоматически преобразуется в WOFF2.
- `@font-face` описывается явно в `src/scss/global/_fonts.scss`, чтобы корректно задавать family, weight и style.

## SFTP deploy

Скопируйте нужные значения из `.env.example` в переменные окружения. `.env` игнорируется Git. Требуются:

- `SFTP_HOST`;
- `SFTP_USER`;
- `SFTP_PASSWORD` или `SFTP_KEY`;
- опционально `SFTP_PORT` и `SFTP_PATH`.

Задача загружает содержимое чистой production-сборки. Она не удаляет посторонние файлы на сервере.
