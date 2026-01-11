import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Link } from 'react-router-dom';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    onClick,
    disabled = false,
    type = 'button',
    fullWidth = false,
    className,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-[--color-primary-gradientStart] to-[--color-primary-gradientEnd] text-white hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary-light/40 disabled:hover:translate-y-0 disabled:hover:shadow-none',
        secondary: 'bg-secondary-light text-secondary hover:bg-gray-300',
        danger: 'bg-danger text-white hover:bg-danger-dark hover:translate-y-[-2px] disabled:hover:translate-y-0',
        success: 'bg-success text-white hover:bg-success-dark',
        outline: 'border-2 border-primary-light text-primary-light hover:bg-primary-light/10',
        ghost: 'text-primary-light hover:bg-primary-light/10',
    };

    // Mapping for gradient colors since we defined them in config but used specific hexes in CSS. 
    // Actually, I'll use the config colors directly.
    // Fixed variant implementation to use tailwind config colors properly.
    const resolvedVariants = {
        primary: 'bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40 focus:ring-primary',
        secondary: 'bg-secondary-light text-secondary hover:bg-gray-300 focus:ring-secondary',
        danger: 'bg-danger text-white hover:bg-danger-dark hover:-translate-y-0.5 focus:ring-danger',
        success: 'bg-success text-white hover:bg-success-dark focus:ring-success',
        outline: 'border-2 border-primary-light text-primary-light hover:bg-primary-light/10 focus:ring-primary',
        ghost: 'text-primary-light hover:bg-primary-light/10 focus:ring-primary',
    };

    const sizes = {
        small: 'px-3 py-1.5 text-xs',
        medium: 'px-5 py-2.5 text-sm',
        large: 'px-7 py-3.5 text-base',
    };

    const classes = twMerge(
        clsx(
            baseStyles,
            resolvedVariants[variant],
            sizes[size],
            fullWidth && 'w-full',
            className
        )
    );

    if (props.to) {
        return (
            <Link className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
