import React, { useEffect, useState } from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({
    onAddIncome,
    editingIncome = null,
}) => {
    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    });

    useEffect(() => {
        if (editingIncome) {
            setIncome({
                source: editingIncome.source || "",
                amount: editingIncome.amount || "",
                date: editingIncome.date
                    ? new Date(editingIncome.date)
                          .toISOString()
                          .split("T")[0]
                    : "",
                icon: editingIncome.icon || "",
            });
        } else {
            setIncome({
                source: "",
                amount: "",
                date: "",
                icon: "",
            });
        }
    }, [editingIncome]);

    const handleChange = (key, value) => {
        setIncome((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) =>
                    handleChange("icon", selectedIcon)
                }
            />

            <Input
                value={income.source}
                onChange={({ target }) =>
                    handleChange("source", target.value)
                }
                label="Income Source"
                placeholder="Freelance, Salary, etc"
                type="text"
            />

            <Input
                value={income.amount}
                onChange={({ target }) =>
                    handleChange("amount", target.value)
                }
                label="Amount"
                placeholder=""
                type="number"
            />

            <Input
                value={income.date}
                onChange={({ target }) =>
                    handleChange("date", target.value)
                }
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="add-btn add-btn-fill"
                    onClick={() =>
                        onAddIncome(
                            editingIncome
                                ? {
                                      ...income,
                                      _id: editingIncome._id,
                                  }
                                : income
                        )
                    }
                >
                    {editingIncome
                        ? "Update Income"
                        : "Add Income"}
                </button>
            </div>
        </div>
    );
};

export default AddIncomeForm;