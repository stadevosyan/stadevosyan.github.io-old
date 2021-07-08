(function() {
    "use strict";

    let modalElem;
    const __scheduleButtonSelector = '#scheduleNow'
    const __scheduleModalSelector = '.modal-my'

    const select = (el, all = false) => {
        console.log('inside select')
        console.log({el})
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


    window.addEventListener('load', function(e) {
        console.log('inside load listener')
        if (select(__scheduleButtonSelector)) {
            window.console.log('entered if')



            on('click', __scheduleButtonSelector, () => {
                modalElem = document.createElement('div');
                modalElem.classList.add('modal-my');

                const elemModal = document.createElement('div');
                elemModal.classList.add('modal-box-my');

                modalElem.appendChild(elemModal)

                const closeButton = document.createElement('span');
                closeButton.classList.add('close-button-my');
                closeButton.innerHTML = 'X'

                elemModal.appendChild(closeButton)

                const elemIframe = document.createElement('iframe');
                elemIframe.src = 'http://localhost:8080'

                elemModal.appendChild(elemIframe)
                modalElem.classList.add('show-modal-my');

                document.body.appendChild(modalElem);
                const deleteModal = () => {
                    document.body.removeChild(modalElem)
                    modalElem = undefined
                };
                const windowOnClick = (e) => {
                    if (e.target === modalElem) {
                        deleteModal();
                    }
                }
                // window.addEventListener("click", windowOnClick);


                on('click', '.close-button-my', deleteModal)
            })
        }
    })
  })()