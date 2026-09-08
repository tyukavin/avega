function initTeamSlider() {
    const mount = document.querySelector("[data-team-slider]");
    if (!mount) return;

    const list = mount.querySelector("[data-team-list]");
    const prev = mount.querySelector("[data-team-prev]");
    const next = mount.querySelector("[data-team-next]");
    if (!list || !prev || !next) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    const getStep = () => {
        const firstItem = list.querySelector(".experts-team__item");
        if (!firstItem) return list.clientWidth;

        const gap = Number.parseFloat(getComputedStyle(list).columnGap || "0");
        return firstItem.getBoundingClientRect().width + gap;
    };

    const scrollByStep = (direction) => {
        list.scrollBy({
            left: direction * getStep(),
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    };

    prev.addEventListener("click", () => scrollByStep(-1));
    next.addEventListener("click", () => scrollByStep(1));
}

initTeamSlider();
