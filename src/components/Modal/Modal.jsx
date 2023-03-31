import { Component } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, ModalBox, ModalImg } from './Modal.styled';
import propTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    if (e.code === 'Escape') {
      this.props.closeModal();
    }
  };

  handleClickBackdrop = e => {
    if (e.currentTarget === e.target) {
      this.props.closeModal();
    }
  };

  render() {
    return createPortal(
      <Overlay onClick={this.handleClickBackdrop}>
        <ModalBox>
          <ModalImg src={this.props.modalImage} alt={this.props.modalAlt} />
        </ModalBox>
      </Overlay>,
      modalRoot
    );
  }
}

Modal.propTypes = {
  modalImage: propTypes.string.isRequired,
  modalAlt: propTypes.string.isRequired,
  closeModal: propTypes.func.isRequired,
};
