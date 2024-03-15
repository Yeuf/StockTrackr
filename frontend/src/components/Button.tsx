import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'small' | 'large';
  color?: 'indigo' | 'green' | 'gray' | 'red' | 'blue';
  extraClasses?: string;
  px?: number;
  py?: number;
};

const Button: React.FC<ButtonProps> = ({ onClick, className, size, color = 'indigo', extraClasses, px, py, children, ...rest }) => {
  const baseClasses = 'text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2';

  return (
    <button
      onClick={onClick}
      className={clsx(
        baseClasses,
        {
          [`px-${px}`]: px !== undefined,
          [`py-${py}`]: py !== undefined,
          'text-xs': size === 'small',
          'text-lg': size === 'large',
          'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500': color === 'indigo',
          'bg-green-600 hover:bg-green-700 focus:ring-green-500': color === 'green',
          'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500': color === 'gray',
          'bg-red-600 hover:bg-red-700 focus:ring-red-500': color === 'red',
          'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': color === 'blue',
        },
        extraClasses,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
