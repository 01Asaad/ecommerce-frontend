import React from 'react';

const GridComponent = ({ children }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 p-4">
      {React.Children.map(children, (child) => (
        <div className="min-h-[200px] w-full bg-white rounded-lg shadow-md overflow-hidden">
          {child}
        </div>
      ))}
    </div>
  );
};

export default GridComponent;