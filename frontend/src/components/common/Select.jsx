import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const Select = forwardRef(({
    label,
    error,
    options = [],
    className,
    fullWidth = false,
    helperText,
    id,
    disabled,
    placeholder = "Select an option",
    ...props
}, ref) => {
    const selectId = id || props.name;

    const baseSelectStyles = "block rounded-lg border-2 border-slate-200 bg-white px-4 py-2.5 text-secondary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.7-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.7em] bg-no-repeat bg-[right:1rem_center]";
    const errorSelectStyles = "border-danger focus:border-danger focus:ring-danger/10";

    return (
        <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className="text-sm font-semibold text-secondary ml-0.5"
                >
                    {label}
                </label>
            )}

            <select
                ref={ref}
                id={selectId}
                disabled={disabled}
                className={twMerge(
                    baseSelectStyles,
                    error && errorSelectStyles,
                    fullWidth && "w-full"
                )}
                {...props}
            >
                {placeholder && <option value="" disabled>{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {(error || helperText) && (
                <p className={clsx("text-xs ml-0.5", error ? "text-danger" : "text-gray-500")}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
