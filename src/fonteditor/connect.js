import project from './widget/project';

async function saveProject(fontFamily, ttf) {
    await project.ready();
    const id = await project.add(
        fontFamily,
        ttf,
        options.config
    );
    return id;
}

function main() {
    window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'create-font') {
            const config = event.data.data || {};
            let ttf = null;
            if (config.ttf) {
                ttf = config.ttf;
            }
            if (!ttf) {
                return;
            }
            saveProject(config.fontFamily, ttf).then(function (id) {
                console.info('Project created with ID:', id);
                const lang = (window.navigator.language || 'zh-cn').toLowerCase();
                const baseUrl = window.location.href.slice(0, window.location.href.lastIndexOf('/'));
                const projectUrl = lang === 'zh-cn' ? `${baseUrl}/index.html?project=${id}` : `${baseUrl}/index-en.html?project=${id}`;
                location.replace(projectUrl);
            })
            .catch(e => {
                console.error('Error creating project:', e);
            });
        }
    });
}

main();