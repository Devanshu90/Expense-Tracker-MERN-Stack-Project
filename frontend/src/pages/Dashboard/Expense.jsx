import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosinstance";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import Modal from "../../components/Modal";
import { API_PATHS } from "../../utils/apiPaths";
import ExpenseList from "../../components/Expense/ExpenseList";
import DeleteAlert from "../../components/DeleteAlert";

function Expense() {
    useUserAuth();

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

    const [editingExpense, setEditingExpense] = useState(null);

    // Calculate total expense
    const totalExpense = expenseData.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0
    );

    // Get All Expense Details
    const fetchExpenseDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(
                API_PATHS.EXPENSE.GET_ALL_EXPENSE
            );

            if (response.data) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.log(
                "Something Went Wrong. Please try again.",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // Open Add Expense Modal
    const handleOpenAddExpense = () => {
        setEditingExpense(null);
        setOpenAddExpenseModal(true);
    };

    // Open Edit Expense Modal
    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
        setOpenAddExpenseModal(true);
    };

    // Close Expense Modal
    const handleCloseExpenseModal = () => {
        setOpenAddExpenseModal(false);
        setEditingExpense(null);
    };

    // Handle Add / Update Expense
    const handleAddExpense = async (expense) => {
        const { category, amount, date, icon, _id } = expense;

        // Validation Check
        if (!category?.trim()) {
            toast.error("Category is required.");
            return;
        }

        if (
            !amount ||
            isNaN(amount) ||
            Number(amount) <= 0
        ) {
            toast.error(
                "Amount should be a valid number greater than 0."
            );
            return;
        }

        if (!date) {
            toast.error("Date is required.");
            return;
        }

        try {
            if (_id) {
                await axiosInstance.put(
                    API_PATHS.EXPENSE.UPDATE_EXPENSE(_id),
                    {
                        category,
                        amount,
                        date,
                        icon,
                    }
                );

                toast.success(
                    "Expense updated successfully"
                );
            } else {
                await axiosInstance.post(
                    API_PATHS.EXPENSE.ADD_EXPENSE,
                    {
                        category,
                        amount,
                        date,
                        icon,
                    }
                );

                toast.success(
                    "Expense added successfully"
                );
            }

            handleCloseExpenseModal();
            fetchExpenseDetails();
        } catch (error) {
            console.error(
                "Error saving expense:",
                error.response?.data?.message ||
                    error.message
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to save expense. Please try again."
            );
        }
    };

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(
                API_PATHS.EXPENSE.DELETE_EXPENSE(id)
            );

            setOpenDeleteAlert({
                show: false,
                data: null,
            });

            toast.success(
                "Expense details deleted successfully"
            );

            fetchExpenseDetails();
        } catch (error) {
            console.error(
                "Error deleting expense:",
                error.response?.data?.message ||
                    error.message
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to delete expense. Please try again."
            );
        }
    };

    // Handle download expense details
    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                "expense_details.xlsx"
            );

            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Error downloading expense details:",
                error
            );

            toast.error(
                "Failed to download expense details. Please try again."
            );
        }
    };

    useEffect(() => {
        fetchExpenseDetails();

        return () => {};
    }, []);

    return (
        <DashboardLayout activeMenu="Expense">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    {/* Total Expense Card */}
                    <div className="card">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Total Expense
                                </p>

                                <h2 className="text-3xl font-semibold mt-1">
                                    ₹
                                    {totalExpense.toLocaleString(
                                        "en-IN"
                                    )}
                                </h2>

                                <p className="text-sm text-gray-400 mt-1">
                                    {expenseData.length}{" "}
                                    {expenseData.length === 1
                                        ? "expense"
                                        : "expenses"}{" "}
                                    recorded
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
                                <span className="text-xl font-semibold text-red-500 dark:text-red-400">
                                    ₹
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Expense Overview */}
                    <div>
                        <ExpenseOverview
                            transactions={expenseData}
                            onExpenseIncome={
                                handleOpenAddExpense
                            }
                        />
                    </div>

                    {/* All Expenses */}
                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({
                                show: true,
                                data: id,
                            });
                        }}
                        onEdit={handleEditExpense}
                        onDownload={
                            handleDownloadExpenseDetails
                        }
                    />
                </div>

                {/* Add / Edit Expense Modal */}
                <Modal
                    isOpen={openAddExpenseModal}
                    onClose={handleCloseExpenseModal}
                    title={
                        editingExpense
                            ? "Edit Expense"
                            : "Add Expense"
                    }
                >
                    <AddExpenseForm
                        onAddExpense={handleAddExpense}
                        editingExpense={editingExpense}
                    />
                </Modal>

                {/* Delete Expense Modal */}
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() =>
                        setOpenDeleteAlert({
                            show: false,
                            data: null,
                        })
                    }
                    title="Delete Expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this expense detail?"
                        onDelete={() =>
                            deleteExpense(
                                openDeleteAlert.data
                            )
                        }
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
}

export default Expense;