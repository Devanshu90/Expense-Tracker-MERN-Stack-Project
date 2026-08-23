import React from 'react';
import {
    LuUtensils,
    LuTrendingUp,
    LuTrendingDown,
    LuTrash2,
} from 'react-icons/lu';

const TransactionInfocard = ({
    title,
    icon,
    date,
    amount,
    type,
    hideDeleteBtn,
    onDelete,
}) => {
    const getAmountStyles = () =>
        type === 'income'
            ? 'bg-green-50 text-green-500 dark:bg-green-950 dark:text-green-400'
            : 'bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400';

    return (
        <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60 dark:hover:bg-gray-700/60 transition-colors duration-200">

            {/* Transaction Icon */}
            <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-full">
                {icon ? (
                    <img
                        src={icon}
                        alt={title}
                        className="w-6 h-6"
                    />
                ) : (
                    <LuUtensils />
                )}
            </div>

            {/* Transaction Details */}
            <div className="flex-1 flex items-center justify-between">

                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-100 font-medium">
                        {title}
                    </p>

                    <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                        {date}
                    </p>
                </div>

                <div className="flex items-center gap-2">

                    {/* Delete Button */}
                    {!hideDeleteBtn && (
                        <button
                            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={onDelete}
                        >
                            <LuTrash2 size={18} />
                        </button>
                    )}

                    {/* Amount */}
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${getAmountStyles()}`}
                    >
                        <h6 className="text-xs font-medium">
                            {type === 'income' ? '+' : '-'} ₹{amount}
                        </h6>

                        {type === 'income' ? (
                            <LuTrendingUp />
                        ) : (
                            <LuTrendingDown />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionInfocard;