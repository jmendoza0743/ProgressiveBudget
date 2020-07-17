const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transactionSchema = new Schema(     //This is a mongoose model.  It contains a values field, a name field, and a date field.
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
