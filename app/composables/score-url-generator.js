export function useScoreUrlGenerator() {
    const { public: { corelliTrioSonatasSha } } = useRuntimeConfig();

    function normalizeId(id) {
        return id.replace('schubert-', '');
    }

    function localScoreUrlGenerator(id) {
        const url = `/kern/schubert-dances/${normalizeId(id)}.krn?${corelliTrioSonatasSha}`;
        return url;
    }

    function githubScoreUrlGenerator(id) {
        const url = `https://github.com/WolfgangDrescher/schubert-dances/blob/master/kern/${normalizeId(id)}.krn`;
        return url;
    }

    function githubRawScoreUrlGenerator(id) {
        const url = `https://raw.githubusercontent.com/WolfgangDrescher/schubert-dances/refs/heads/master/kern/${normalizeId(id)}.krn`;
        return url;
    }

    function vhvScoreUrlGenerator(id) {
        const url = `https://verovio.humdrum.org/?file=${encodeURIComponent(githubRawScoreUrlGenerator(normalizeId(id)))}`;
        return url;
    }

    return {
        localScoreUrlGenerator,
        githubScoreUrlGenerator,
        githubRawScoreUrlGenerator,
        vhvScoreUrlGenerator,
    };
}
