import React from 'react';
import { motion, usePresence } from 'framer-motion';

const Turn = ({ turn, color }) => {
  const [isPresent, safeToRemove] = usePresence();

  const transition = { type: 'spring', stiffness: 500, damping: 50, mass: 1 };
  const animations = {
    layout: true,
    initial: 'out',
    animate: isPresent ? 'in' : 'out',
    variants: {
      in: { scaleY: 1, opacity: 1 },
      out: { scaleY: 0, opacity: 0 },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition,
  };

  return (
    <motion.div {...animations}>
      <div key={turn.id} className='flex gap-3 items-center'>
        <div className='block'>
          <div
            className='w-3 h-3'
            style={{
              background: color,
            }}
          ></div>
        </div>

        {turn.repeated ? (
          <div className='uppercase separated text-2xl text-neutral roboto-bold overflow-x-auto'>
            repeated
          </div>
        ) : !turn.word.length && !turn.existent && !turn.accepted ? (
          <div className='uppercase separated text-2xl text-neutral roboto-bold overflow-x-auto'>
            EXPIRED
          </div>
        ) : !turn.existent && !turn.accepted ? (
          <div className='uppercase separated text-2xl text-neutral roboto-bold overflow-x-auto'>
            NONEXISTENT
          </div>
        ) : (
          <div className='separated uppercase text-2xl overflow-x-auto'>
            {turn.word}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Turn;
