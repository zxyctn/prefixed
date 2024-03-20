import React from 'react';

const Separated = ({ content, className = '' }) => {
  return (
    <div className='flex justify-center'>
      <span className={className.length ? className : 'separated'}>
        {content && content.slice(0, -1)}
      </span>
      <span>{content && content[content.length - 1]}</span>
    </div>
  );
};

export default Separated;
