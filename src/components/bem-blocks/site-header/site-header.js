function initSiteHeader() {
    const header = document.querySelector("[data-site-header]");
    if (!header) return;

    const toggle = header.querySelector("[data-menu-toggle]");
    const panel = header.querySelector("[data-menu-panel]");
    const label = header.querySelector("[data-menu-label]");
    const logo = header.querySelector(".site-header__logo");
    const main = document.querySelector("main");
    if (!toggle || !panel || !label || !logo) return;

    const mobileMedia = window.matchMedia("(max-width: 47.99rem)");
    let returnFocus = null;

    const getFocusableElements = () => [
        logo,
        ...panel.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
        toggle,
    ];

    const syncPanelAvailability = () => {
        const isMobile = mobileMedia.matches;
        const isOpen = header.classList.contains("is-open");

        panel.inert = isMobile && !isOpen;
        panel.setAttribute("aria-hidden", String(isMobile && !isOpen));
    };

    const setOpen = (isOpen, { restoreFocus = true } = {}) => {
        const wasOpen = header.classList.contains("is-open");
        if (wasOpen === isOpen) return;

        header.classList.toggle("is-open", isOpen);
        document.body.classList.toggle("is-menu-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        label.textContent = isOpen ? "Закрыть меню" : "Открыть меню";

        if (main) {
            main.inert = isOpen;
        }

        syncPanelAvailability();

        if (isOpen) {
            returnFocus = document.activeElement;
            const firstLink = panel.querySelector("a[href]");
            firstLink?.focus();
        } else if (restoreFocus && returnFocus instanceof HTMLElement) {
            returnFocus.focus();
        }
    };

    const handleToggle = () => {
        setOpen(!header.classList.contains("is-open"));
    };

    const handleKeydown = (event) => {
        if (!header.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            return;
        }

        if (event.key !== "Tab") return;

        const focusable = getFocusableElements();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    };

    const handleLinkClick = (event) => {
        if (!mobileMedia.matches) return;
        if (event.target.closest("a[href]")) {
            setOpen(false, { restoreFocus: false });
        }
    };

    const handleMediaChange = () => {
        if (!mobileMedia.matches) {
            setOpen(false, { restoreFocus: false });
        }
        syncPanelAvailability();
    };

    header.classList.add("is-ready");
    syncPanelAvailability();
    toggle.addEventListener("click", handleToggle);
    panel.addEventListener("click", handleLinkClick);
    document.addEventListener("keydown", handleKeydown);
    mobileMedia.addEventListener("change", handleMediaChange);
}

initSiteHeader();
