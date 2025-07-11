import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  DollarSign,
  Download,
  BarChart,
  PieChart,
} from "lucide-react";
import jsPDF from "jspdf";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [summaryData, setSummaryData] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    failed: 0,
  });
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Simulate fetching payments from an API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // For demonstration, using setTimeout with mock data
        setTimeout(() => {
          const mockData = [
            {
              id: "PAY-87654",
              customer: "Arjun Mehta",
              date: "2025-03-15",
              amount: 1250.0,
              status: "Paid",
              method: "Credit Card",
            },
            {
              id: "PAY-76543",
              customer: "Sneha Reddy",
              date: "2025-03-14",
              amount: 890.5,
              status: "Pending",
              method: "Net Banking",
            },
            {
              id: "PAY-65432",
              customer: "Sanjay Patel",
              date: "2025-03-12",
              amount: 1675.75,
              status: "Paid",
              method: "UPI",
            },
            {
              id: "PAY-54321",
              customer: "Meera Sharma",
              date: "2025-03-10",
              amount: 345.0,
              status: "Failed",
              method: "Credit Card",
            },
            {
              id: "PAY-43210",
              customer: "Rajiv Kumar",
              date: "2025-03-08",
              amount: 925.25,
              status: "Paid",
              method: "Debit Card",
            },
          ];
          setPayments(mockData);

          // Calculate summary data
          const totalAmount = mockData.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );
          const paidAmount = mockData
            .filter((payment) => payment.status === "Paid")
            .reduce((sum, payment) => sum + payment.amount, 0);
          const pendingAmount = mockData
            .filter((payment) => payment.status === "Pending")
            .reduce((sum, payment) => sum + payment.amount, 0);
          const failedAmount = mockData
            .filter((payment) => payment.status === "Failed")
            .reduce((sum, payment) => sum + payment.amount, 0);

          setSummaryData({
            total: totalAmount,
            paid: paidAmount,
            pending: pendingAmount,
            failed: failedAmount,
          });

          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPayments = [...payments].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredPayments = sortedPayments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <CheckCircle className="inline mr-1" size={16} />;
      case "Pending":
        return <Clock className="inline mr-1" size={16} />;
      default:
        return <XCircle className="inline mr-1" size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // PDF download handler
  const handleDownloadPDF = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Payment Details for ${payment.customer}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Payment Mode: ${payment.method || "Credit Card"}`, 10, 35);
    doc.text(
      `Card Number: ${payment.cardNumber || "**** **** **** 1234"}`,
      10,
      45
    );
    doc.text(`Payment ID: ${payment.id}`, 10, 55);
    doc.text(`Product ID: ${payment.productId || "PRD-001"}`, 10, 65);
    doc.text(
      `Order Address: ${payment.address || "123 Main St, City, Country"}`,
      10,
      75
    );
    doc.text(`Amount: ₹${payment.amount}`, 10, 85);
    doc.save(`Payment_${payment.id}.pdf`);
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`p-6 transition-all duration-300 ${
          selectedPayment ? "filter blur-sm" : ""
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
          <div className="flex gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center">
              <Download className="mr-1" size={18} />
              Export
            </button>
            <Link
              to="/dashboard/payments/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <CreditCard className="mr-2" size={18} />
              Record Payment
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-blue-100 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-blue-800">
                Total Revenue
              </h3>
              <DollarSign className="text-blue-700" size={20} />
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(summaryData.total)}
            </p>
            <div className="mt-2 text-sm text-blue-700">
              From {payments.length} transactions
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-green-100 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-green-800">
                Payments Received
              </h3>
              <CheckCircle className="text-green-700" size={20} />
            </div>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(summaryData.paid)}
            </p>
            <div className="mt-2 text-sm text-green-700">
              {((summaryData.paid / summaryData.total) * 100).toFixed(1)}% of
              total
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-yellow-100 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-yellow-800">
                Pending Payments
              </h3>
              <Clock className="text-yellow-700" size={20} />
            </div>
            <p className="text-2xl font-bold text-yellow-900">
              {formatCurrency(summaryData.pending)}
            </p>
            <div className="mt-2 text-sm text-yellow-700">
              {((summaryData.pending / summaryData.total) * 100).toFixed(1)}% of
              total
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-red-100 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-red-800">
                Failed Payments
              </h3>
              <XCircle className="text-red-700" size={20} />
            </div>
            <p className="text-2xl font-bold text-red-900">
              {formatCurrency(summaryData.failed)}
            </p>
            <div className="mt-2 text-sm text-red-700">
              {((summaryData.failed / summaryData.total) * 100).toFixed(1)}% of
              total
            </div>
          </motion.div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by ID, customer or payment method..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Loading payment data...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <CreditCard size={64} className="text-gray-300 mb-4" />
              <p className="text-xl font-medium mb-2">No payments found</p>
              <p>
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Payment ID
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("customer")}
                    >
                      <div className="flex items-center">
                        Customer
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center">
                        Payment Date
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("method")}
                    >
                      <div className="flex items-center">
                        Method
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center">
                        Amount
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown size={14} className="ml-1" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <motion.tr
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {payment.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {payment.customer}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {payment.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {payment.method}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          className="text-blue-600 hover:text-blue-700 hover:underline"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal for Payment Details */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedPayment(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              {selectedPayment.customer}
            </h2>
            <div className="mb-2">
              <strong>Payment Status:</strong> {selectedPayment.status}
            </div>
            <div className="mb-2">
              <strong>Payment Mode:</strong>{" "}
              {selectedPayment.method || "Credit Card"}
            </div>
            <div className="mb-2">
              <strong>Credit Card Number:</strong>{" "}
              {selectedPayment.cardNumber || "**** **** **** 1234"}
            </div>
            <div className="mb-2">
              <strong>Payment ID:</strong> {selectedPayment.id}
            </div>
            <div className="mb-2">
              <strong>Product ID:</strong>{" "}
              {selectedPayment.productId || "PRD-001"}
            </div>
            <div className="mb-2">
              <strong>Order Address:</strong>{" "}
              {selectedPayment.address || "123 Main St, City, Country"}
            </div>
            <div className="mb-2">
              <strong>Amount:</strong> ₹{selectedPayment.amount}
            </div>
            <button
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition"
              onClick={() => handleDownloadPDF(selectedPayment)}
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsList;
