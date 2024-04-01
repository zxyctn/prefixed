import React from 'react';
import { motion, usePresence } from 'framer-motion';

import type { GameTurnType } from '../types';

const Turn = ({
  turn,
  color,
  points = null,
}: {
  points?: number | null;
  color: string;
  turn: GameTurnType | string;
}) => {
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
      <div
        key={typeof turn !== 'string' ? turn.id : turn}
        className='flex gap-3 sm:gap-4 md:gap-5 items-center h-full'
      >
        <div className='flex items-center'>
          <div
            className={points !== null ? 'tooltip tooltip-right' : ''}
            data-tip={`${points} ${points === 1 ? 'point' : 'points'}`}
          >
            <div
              className='w-3 h-3 md:w-4 md:h-4'
              style={{
                background: color,
              }}
            ></div>
          </div>
        </div>

        {typeof turn !== 'string' &&
        turn.repeated !== undefined &&
        turn.existent !== undefined ? (
          turn.repeated ? (
            <div className='uppercase separated text-lg sm:text-xl md:text-2xl lg:text-3xl text-neutral roboto-bold overflow-x-auto'>
              repeated
            </div>
          ) : !turn.word.length && !turn.existent && !turn.accepted ? (
            <div className='uppercase separated text-lg sm:text-xl md:text-2xl lg:text-3xl text-neutral roboto-bold overflow-x-auto'>
              EXPIRED
            </div>
          ) : !turn.existent && !turn.accepted ? (
            <div className='uppercase separated text-lg sm:text-xl md:text-2xl lg:text-3xl text-neutral roboto-bold overflow-x-auto'>
              NONEXISTENT
            </div>
          ) : (
            <div className='separated uppercase text-lg sm:text-xl md:text-2xl lg:text-3xl overflow-x-auto'>
              {turn.word}
            </div>
          )
        ) : (
          <div className='separated uppercase text-lg overflow-x-auto whitespace-nowrap'>
            {typeof turn === 'string' && turn}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Turn;
