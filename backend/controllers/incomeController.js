const xlsx = require("xlsx");
const Income = require("../models/Income");

// Add Income
exports.addIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save();

        res.status(200).json(newIncome);
    } catch (error) {
        console.error("Error adding income:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// Get All Income
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({
            date: -1,
        });

        res.json(income);
    } catch (error) {
        console.error("Error fetching income:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// Update Income
exports.updateIncome = async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;

    try {
        const { icon, source, amount, date } = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({
                message:
                    "Amount should be a valid number greater than 0",
            });
        }

        const income = await Income.findOne({
            _id: incomeId,
            userId,
        });

        if (!income) {
            return res.status(404).json({
                message: "Income not found",
            });
        }

        income.source = source;
        income.amount = amount;
        income.date = new Date(date);
        income.icon = icon;

        await income.save();

        res.status(200).json(income);
    } catch (error) {
        console.error("Error updating income:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// Delete Income
exports.deleteIncome = async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;

    try {
        const income = await Income.findOne({
            _id: incomeId,
            userId,
        });

        if (!income) {
            return res.status(404).json({
                message: "Income not found",
            });
        }

        await Income.findByIdAndDelete(incomeId);

        res.json({
            message: "Income deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting income:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// Download Excel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({
            date: -1,
        });

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

        xlsx.utils.book_append_sheet(
            wb,
            ws,
            "Income"
        );

        xlsx.writeFile(
            wb,
            "income_details.xlsx"
        );

        res.download("income_details.xlsx");
    } catch (error) {
        console.error(
            "Error downloading income details:",
            error
        );

        res.status(500).json({
            message: "Server Error",
        });
    }
};