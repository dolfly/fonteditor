import project from './widget/project';

async function saveProject(fontFamily, ttf) {
    await project.ready();
    const id = await project.add(
        fontFamily,
        ttf,
        {}
    );
    return id;
}

function main() {
    if (parent !== window) {
        parent.postMessage({ type: 'loaded', data: {} }, '*');
    }
    else if (window.opener) {
        window.opener.postMessage({ type: 'loaded', data: {} }, '*');
    }

    window.addEventListener('message', function (event) {
        if (event.data && event.data.type === 'create-font') {
            const config = event.data.data || {};
            let ttf = null;
            if (config.ttfObject) {
                ttf = config.ttfObject;
                console.info('Received ttfObject from parent:', event.data.type);
            }
            if (!ttf) {
                return;
            }
            const baseUrl = window.location.href.slice(0, window.location.href.lastIndexOf('/'));
            const lang = (window.navigator.language || 'zh-cn').toLowerCase();

            saveProject(config.fontFamily, ttf).then((projectId) => {
                console.info('Project created with ID:', projectId);
                const projectUrl = `${baseUrl}/${lang === 'zh-cn' ? 'index' : 'index-en'}.html?project=${projectId}`;
                if (parent !== window) {
                    parent.postMessage({ type: 'create-font-result', data: {success: true, projectId, projectUrl} }, '*');
                }
                else {
                    location.replace(projectUrl);
                }
            })
            .catch(e => {
                console.error('Error creating project:', e);
                if (parent !== window) {
                    parent.postMessage({ type: 'creat-font-result', data: {success: false, error: e.message } }, '*');
                }
                else {
                    location.replace(`${baseUrl}/${lang === 'zh-cn' ? 'index' : 'index-en'}.html`);
                }
            });
        }
    });
}

main();