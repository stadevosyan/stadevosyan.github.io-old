(function() {
    "use strict";

    // -- get token --
    let tenantToken = ''
    let iframeOrigin = 'http://localhost:8080'

    try {
        const script_tag = document.getElementById('st-w-scheduler')
        const query = script_tag.src.replace(/^[^?]+\??/, '');

        // Parse the querystring into arguments and parameters
        const paramsList = query.split("&");
        const params = {};
        for (let i = 0; i < paramsList.length; i++) {
            let [key, value] = paramsList[i].split("=");
            params[key] = decodeURIComponent(value).replace(/\+/g, ' ');
        }

        tenantToken = params['token'];
        if (!tenantToken) {
            initFailed()
        }
    } catch {
        initFailed()
    }

    window.StWidgetsData = {}
    window.StWidgetsData.WebScheduler = {
        tenantToken
    }

    function initFailed() {
        console.error('Web-Scheduler initialization failed!')
    }

    if (tenantToken) {
        // -- define selectors --
        let iframeContainer;
        const __scheduleButtonSelector = '#scheduleNow'

        // -- define handlers --
        const select = (el, all = false) => {
            el = el.trim()
            if (all) {
                return [...document.querySelectorAll(el)]
            } else {
                return document.querySelector(el)
            }
        }

        const on = (type, el, listener, all = false) => {
            let selectEl = select(el, all)
            if (selectEl) {
                if (all) {
                    selectEl.forEach(e => e.addEventListener(type, listener))
                } else {
                    selectEl.addEventListener(type, listener)
                }
            }
        }

        // -- check if valid button is available
        function validateSchedulingButton() {
            if (!select(__scheduleButtonSelector)) {
                console.error('Scheduling button is not available')
                return false
            }
            return true
        }

        function setIframeContainerStyles(container) {
            const {style} = container
            style.position = 'fixed'
            style.zIndex = 9999999
            style.width = '100%'
            style.height = '100%'
            style.left = 0
            style.top = 0
            style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
            style.visibility = 'hidden';
        }

        if (validateSchedulingButton()) {
            const bodyOverflow = document.body.style.overflow;

            // -- create and style iframe
            iframeContainer = document.createElement('div');
            setIframeContainerStyles(iframeContainer)

            // modal actions
            const hideModal = () => {
                iframeContainer.style.visibility = 'hidden';
                document.body.style.overflow = bodyOverflow;
            };

            const showModal = () => {
                iframeContainer.style.visibility = 'visible'
                // TODO, store also height=100%, width=100%, padding=0
                document.body.style.overflow = 'hidden'
            };

            const elemIframe = document.createElement('iframe');
            elemIframe.src = iframeOrigin + '?token=' + tenantToken;
            elemIframe.style.width = '100%';
            elemIframe.style.height = '100%';

            iframeContainer.appendChild(elemIframe)
            document.body.insertBefore(iframeContainer, document.body.firstChild);

            // -- load iframe
            window.addEventListener('load', function (e) {
                if (select(__scheduleButtonSelector)) {
                    on('click', __scheduleButtonSelector, () => {
                        showModal();
                    })
                }
            })

            window.addEventListener('message', (e) => {
                console.log({e})
                if (e.origin === iframeOrigin) {
                    if (e.data === 'ready') {
                        console.log('helllllo')
                    }

                    if (e.data === 'close') {
                        console.log('close')
                    }
                }
            })
        }
    }
  })()