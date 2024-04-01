import React from 'react';

const Separated = ({ content, className = '' }) => {
  return (
    <div className='flex justify-center items-center text-lg sm:text-xl md:text-2xl lg:text-3xl'>
      <div className='uppercase text-center'>
        <span className={` ${className.length ? className : 'separated'}`}>
          {content && content.slice(0, -1)}
        </span>
        <span>{content && content[content.length - 1]}</span>
      </div>
    </div>
  );
};

export default Separated;
