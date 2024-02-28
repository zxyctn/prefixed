import React, { useEffect, useRef } from 'react';
import Button from './Button';

const Confirm = ({
  id,
  children,
  title,
  confirmButtonText,
  cancelButtonText,
  onConfirm = () => {},
  onCancel = () => {},
}: {
  id: string;
  children?;
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) => {
  const dialog = useRef(null);

  const handleConfirm = (e, result) => {
    e.preventDefault();

    if (dialog.current) {
      (dialog.current as HTMLDialogElement).close();
    }

    result ? onConfirm() : onCancel();
  };

  useEffect(() => {
    if (!dialog.current) {
      return;
    }
    (dialog.current as HTMLDialogElement).addEventListener(
      'cancel',
      (event) => {
        event.preventDefault();
      }
    );
  }, [dialog]);

  return (
    <dialog
      id={id}
      className='modal sm:modal-middle'
      data-keyboard='false'
      ref={dialog}
    >
      <div className='modal-box relative '>
        <h1 className='bg-neutral absolute top-0 left-0 separated roboto-regular uppercase text-center p-3 w-full'>
          {title}
        </h1>
        <div className='mt-12'>
          {children}
          <div className='modal-action w-full gap-5'>
            <form
              action='dialog'
              className='grid gap-5 place-content-stretch place-items-stretch place-self-stretch w-full'
            >
              <Button
                className='btn-primary text-white'
                onClick={(e) => {
                  handleConfirm(e, true);
                }}
              >
                {confirmButtonText}
              </Button>
              <Button
                className='btn-secondary'
                onClick={(e) => {
                  handleConfirm(e, false);
                }}
              >
                {cancelButtonText}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default Confirm;
