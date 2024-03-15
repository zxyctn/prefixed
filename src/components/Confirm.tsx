import React, { useEffect, useRef, useState } from 'react';
import Button from './Button';

const Confirm = ({
  id,
  children,
  title,
  confirmButtonText,
  cancelButtonText,
  onConfirm = () => {},
  onCancel = () => {},
  onTimerFinish = () => {},
  duration,
}: {
  id: string;
  children?;
  title: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onTimerFinish?: () => void;
  duration?: {
    duration: number;
    startedAt: Date;
  };
}) => {
  const dialog = useRef(null);
  const [timer, setTimer] = useState<{ duration: number; current: number }>();

  useEffect(() => {
    if (duration) {
      const startedAt = new Date(duration.startedAt);
      const now = new Date();
      const diff = now.getTime() - startedAt.getTime();
      const current = Math.floor(diff / 1000);
      setTimer({ duration: duration.duration, current });
    }
  }, [duration]);

  useEffect(() => {
    let interval;

    if (timer) {
      interval = setInterval(() => {
        setTimer((old) => {
          if (old && old.current < old.duration) {
            return { ...old, current: old.current + 0.1 };
          } else if (dialog.current && old && old.current >= old.duration) {
            onTimerFinish();
            setTimer(undefined);
          }
          return old;
        });
      }, 1);

      return () => clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

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

  const handleConfirm = (e, result) => {
    e.preventDefault();
    setTimer(undefined);

    if (dialog.current) {
      (dialog.current as HTMLDialogElement).close();
    }

    result ? onConfirm() : onCancel();
  };

  return (
    <dialog
      id={id}
      className='modal sm:modal-middle'
      data-keyboard='false'
      ref={dialog}
    >
      <div className='modal-box relative '>
        {timer && timer.current < timer.duration && (
          <progress
            className='progress progress-primary absolute top-0 w-full left-0'
            value={timer.current}
            max={timer.duration}
          ></progress>
        )}
        <h1
          className={`bg-neutral absolute left-0 separated roboto-regular uppercase text-center p-3 w-full ${
            timer && timer.current < timer.duration ? 'top-2' : 'top-0'
          }`}
        >
          {title}
        </h1>

        <div
          className={` ${
            timer && timer.current < timer.duration ? 'mt-14' : 'mt-12'
          }`}
        >
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
