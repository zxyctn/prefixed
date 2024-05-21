import React from 'react';

const Separated = ({ content, className = '' }) => {
  return (
    <div className='flex justify-center items-center text-lg md:text-xl lg:text-2xl'>
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
