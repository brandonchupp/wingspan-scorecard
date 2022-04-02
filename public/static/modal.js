class Modal{
    constructor(){
        let modal = document.querySelector('#modal');
        if (!modal) {
            modal = document.createElement('dialog');
            modal.id = 'modal';
            modal.innerHTML = (
                '<article><h2 class="modal-title"></h2>'
                        + '<div class="modal-body"></div>'
                        + '<footer></footer></article>'
            );
            document.querySelector('body').appendChild(modal);
        }
        this.modal = modal;
    }

    show() {
        this.modal.setAttribute('open', true);
    }

    hide() {
        this.modal.removeAttribute('open');
    }

    setTitle(content) {
        this.modal.querySelector('.modal-title').innerHTML = content;
    }

    setBody(content) {
        this.modal.querySelector('.modal-body').innerHTML = content;
    }

    setFooter(content) {
        this.modal.querySelector('footer').innerHTML = content;
    }
}