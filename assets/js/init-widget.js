(function() {
    "use strict";

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
            const elem = document.createElement('div');

            const toggleModal = () => modal.classList.toggle("show-modal-my");
            const windowOnClick = (e) => {
                if (e.target === modal) {
                    toggleModal();
                }
            }

            let modal = select(__scheduleModalSelector);
            window.addEventListener("click", windowOnClick);

            on('click', '.close-button-my', toggleModal)
            on('click', __scheduleButtonSelector, toggleModal)
        }
    })
  })()