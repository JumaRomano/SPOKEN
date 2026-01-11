const Card = ({ children, title, subtitle, actions, className = "" }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
            {(title || subtitle || actions) && (
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
                    <div className="flex-1">
                        {title && <h3 className="text-lg font-semibold text-secondary mb-0.5">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                    </div>
                    {actions && <div className="flex gap-2 ml-4">{actions}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
};

export default Card;
