const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
            return res
                .status(400)
                .json({ message: "All fields are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();

        res.status(200).json(newExpense);
    } catch (error) {
        console.error("Error adding expense:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// Get All Expenses
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({
            date: -1,
        });

        res.json(expense);
    } catch (error) {
        console.error("Error fetching expenses:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// Update Expense
exports.updateExpense = async (req, res) => {
    const userId = req.user.id;
    const expenseId = req.params.id;

    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
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

        const expense = await Expense.findOne({
            _id: expenseId,
            userId,
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found",
            });
        }

        expense.category = category;
        expense.amount = amount;
        expense.date = new Date(date);
        expense.icon = icon;

        await expense.save();

        res.status(200).json(expense);
    } catch (error) {
        console.error("Error updating expense:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
    const userId = req.user.id;
    const expenseId = req.params.id;

    try {
        const expense = await Expense.findOne({
            _id: expenseId,
            userId,
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found",
            });
        }

        await Expense.findByIdAndDelete(expenseId);

        res.json({
            message: "Expense deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting expense:", error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({
            date: -1,
        });

        const data = expense.map((item) => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date,
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);

        xlsx.utils.book_append_sheet(
            wb,
            ws,
            "expense"
        );

        xlsx.writeFile(
            wb,
            "expense_details.xlsx"
        );

        res.download("expense_details.xlsx");
    } catch (error) {
        console.error(
            "Error downloading expense details:",
            error
        );

        res.status(500).json({
            message: "Server Error",
        });
    }
};