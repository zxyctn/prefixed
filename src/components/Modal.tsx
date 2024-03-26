import React from 'react';

import Separated from './Separated';

const Modal = ({ id, children, title }) => {
  return (
    <dialog id={id} className='modal sm:modal-middle'>
      <div className='modal-box'>
        <h1 className='bg-neutral absolute left-0 top-0 roboto-regular uppercase text-center p-3 w-full'>
          <Separated content={title} />
        </h1>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
            ✕
          </button>
        </form>
        <div className='mt-12'>{children}</div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default Modal;
