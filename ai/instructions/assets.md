# Шрифты, изображения и новые страницы

## Шрифты

- Исходные шрифты в `src/fonts/`: WOFF/WOFF2 копируются в `build/fonts`, TTF автоматически конвертируются в WOFF2 через wawoff2.
- `@font-face` описывай явно в `src/scss/global/_fonts.scss`. Указывай `font-family`, `font-weight`, `font-style` и `font-display: swap`.
- Подключай только используемые начертания и форматы. Не задерживай отображение текста ненужными ресурсами.

Пример объявления в `_fonts.scss`:

```scss
@font-face {
    font-display: swap;
    font-family: "MyFont";
    font-style: normal;
    font-weight: 400;
    src:
        url("../fonts/myfont.woff2") format("woff2"),
        url("../fonts/myfont.woff") format("woff");
}
```

## Изображения

- Растровые изображения (PNG, JPEG, GIF) и SVG в `src/img/` оптимизируются сборкой:
    - PNG/JPEG → оптимизация Sharp + генерация WebP и AVIF рядом
    - SVG → SVGO-оптимизация
    - Остальные файлы копируются без изменений
- Для адаптивной вёрстки используй `<picture>` с `<source type="image/webp">` и `<source type="image/avif">`, ссылаясь на те же имена с расширением `.webp`/`.avif`.
- Результаты оптимизации никогда не записываются обратно в `src/`.

## SVG-спрайты

- `src/svg/sprite/*.svg` → собираются в symbol-спрайт `build/img/sprite.svg`
- `src/svg/css/*.svg` → data URI, доступны как CSS-класс `.--svg__имя-файла`
- Исходники SVG не редактируются сборкой, результат в `build/`

## Добавление новой страницы

1. Создай HTML-файл в корне `src/` (например, `src/about.html`) с полной структурой документа (`<!doctype html>`, `<html lang="ru">`, `<head>`, `<body>`).
2. Подключи общие шаблоны через `@@include`:
    ```html
    @@include('components/page-blocks/_head.html', {"title": "О компании"})
    ```
3. Добавь стили компонента в `src/scss/style.scss` через `@use`.
4. Для JS-логики новой страницы создай модуль в `src/js/` и добавь импорт в `src/js/01_main.js`.
5. Выполни `npm run build` и `npm run lint:html` для валидации результата.
