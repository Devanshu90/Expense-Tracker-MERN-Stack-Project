import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import toast from "react-hot-toast";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from "../../components/DeleteAlert";
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {
    useUserAuth();

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const [openAddIncomeModal, setOpenAddIncomeModal] =
        useState(false);

    const [editingIncome, setEditingIncome] = useState(null);

    // Get All Income Details
    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(
                API_PATHS.INCOME.GET_ALL_INCOME
            );

            if (response.data) {
                setIncomeData(response.data);
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

    // Open Add Income Modal
    const handleOpenAddIncome = () => {
        setEditingIncome(null);
        setOpenAddIncomeModal(true);
    };

    // Open Edit Income Modal
    const handleEditIncome = (income) => {
        setEditingIncome(income);
        setOpenAddIncomeModal(true);
    };

    // Close Income Modal
    const handleCloseIncomeModal = () => {
        setOpenAddIncomeModal(false);
        setEditingIncome(null);
    };

    // Handle Add / Update Income
    const handleAddIncome = async (income) => {
        const {
            source,
            amount,
            date,
            icon,
            _id,
        } = income;

        // Validation Check
        if (!source?.trim()) {
            toast.error("Source is required.");
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
                    API_PATHS.INCOME.UPDATE_INCOME(_id),
                    {
                        source,
                        amount,
                        date,
                        icon,
                    }
                );

                toast.success(
                    "Income updated successfully"
                );
            } else {
                await axiosInstance.post(
                    API_PATHS.INCOME.ADD_INCOME,
                    {
                        source,
                        amount,
                        date,
                        icon,
                    }
                );

                toast.success(
                    "Income added successfully"
                );
            }

            handleCloseIncomeModal();
            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error saving income:",
                error.response?.data?.message ||
                    error.message
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to save income. Please try again."
            );
        }
    };

    // Delete Income
    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(
                API_PATHS.INCOME.DELETE_INCOME(id)
            );

            setOpenDeleteAlert({
                show: false,
                data: null,
            });

            toast.success(
                "Income details deleted successfully"
            );

            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error deleting income:",
                error.response?.data?.message ||
                    error.message
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to delete income. Please try again."
            );
        }
    };

    // Handle download income details
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.INCOME.DOWNLOAD_INCOME,
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
                "income_details.xlsx"
            );

            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Error downloading income details:",
                error
            );

            toast.error(
                "Failed to download income details. Please try again."
            );
        }
    };

    useEffect(() => {
        fetchIncomeDetails();

        return () => {};
    }, []);

    return (
        <DashboardLayout activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    {/* Income Overview */}
                    <div>
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={handleOpenAddIncome}
                        />
                    </div>

                    {/* Income List */}
                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({
                                show: true,
                                data: id,
                            });
                        }}
                        onEdit={handleEditIncome}
                        onDownload={
                            handleDownloadIncomeDetails
                        }
                    />
                </div>

                {/* Add / Edit Income Modal */}
                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={handleCloseIncomeModal}
                    title={
                        editingIncome
                            ? "Edit Income"
                            : "Add Income"
                    }
                >
                    <AddIncomeForm
                        onAddIncome={handleAddIncome}
                        editingIncome={editingIncome}
                    />
                </Modal>

                {/* Delete Income Modal */}
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() =>
                        setOpenDeleteAlert({
                            show: false,
                            data: null,
                        })
                    }
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income detail?"
                        onDelete={() =>
                            deleteIncome(
                                openDeleteAlert.data
                            )
                        }
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Income;