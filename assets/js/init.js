(function() {
    "use strict";

    // -- get token --
    let tenantToken = ''
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
        let modalElem;
        const __scheduleButtonSelector = '#scheduleNow'
        const __scheduleModalClass = 'modal-my'
        const __closeModalButtonClass = 'close-button-my'
        const __modalVisibleClass = 'show-modal-my'

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
            console.log('entered on')
            console.log({el})
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

        if (validateSchedulingButton()) {
            // -- load iframe
            modalElem = document.createElement('div');
            modalElem.classList.add(__scheduleModalClass);

            const elemModal = document.createElement('div');
            elemModal.classList.add('modal-box-my');

            modalElem.appendChild(elemModal)

            const closeButton = document.createElement('span');
            closeButton.addEventListener('click', () => {
                console.log('onclick')
            })
            closeButton.classList.add(__closeModalButtonClass);
            closeButton.innerHTML = 'X'

            elemModal.appendChild(closeButton)

            const elemIframe = document.createElement('iframe');
            elemIframe.src = 'http://localhost:8080?token=' + tenantToken;
            elemModal.appendChild(elemIframe)

            document.body.appendChild(modalElem);

            const hideModal = () => {
                console.log('trying to remove class')
                modalElem.classList.remove(__modalVisibleClass);
            };
            on('click', '.' + __closeModalButtonClass, hideModal)

            // -- load iframe
            window.addEventListener('load', function (e) {
                if (select(__scheduleButtonSelector)) {
                    console.log('entered if')
                    on('click', __scheduleButtonSelector, () => {
                        modalElem.classList.add(__modalVisibleClass);
                    })
                }
            })
        }
    }
  })()