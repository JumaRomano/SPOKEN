import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({
    label,
    error,
    type = 'text',
    className,
    fullWidth = false,
    helperText,
    id,
    disabled,
    ...props
}, ref) => {
    const inputId = id || props.name;

    const baseInputStyles = "block rounded-lg border-2 border-slate-200 bg-white px-4 py-2.5 text-secondary placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-200";
    const errorInputStyles = "border-danger focus:border-danger focus:ring-danger/10";

    return (
        <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-sm font-semibold text-secondary ml-0.5"
                >
                    {label}
                </label>
            )}

            <input
                ref={ref}
                type={type}
                id={inputId}
                disabled={disabled}
                className={twMerge(
                    baseInputStyles,
                    error && errorInputStyles,
                    fullWidth && "w-full"
                )}
                {...props}
            />

            {(error || helperText) && (
                <p className={clsx("text-xs ml-0.5", error ? "text-danger" : "text-gray-500")}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
