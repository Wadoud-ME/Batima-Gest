"use client";

import { useState } from "react";
import { Card, Button, Input, Label } from "@/components/ui";
import {
  CreditCard,
  Search,
  ArrowDownToLine,
  Receipt,
  FileText,
  CheckCircle2,
  CircleDashed,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export function PaymentsClient({
  isAdmin,
  currentUser,
}: {
  isAdmin: boolean;
  currentUser: any;
}) {
  const [payments] = useState([
    {
      id: "INV-2023-04-01",
      description: "Monthly HOA Dues - April",
      amount: 450.0,
      status: "paid",
      dueDate: "2024-04-01",
      resident: { name: "Resident John", id: "user-1", unit: "Apt 4B" },
    },
    {
      id: "INV-2023-05-01",
      description: "Monthly HOA Dues - May",
      amount: 450.0,
      status: "pending",
      dueDate: "2024-05-01",
      resident: { name: "Resident John", id: "user-1", unit: "Apt 4B" },
    },
    {
      id: "INV-2023-04-05",
      description: "Gym Key Fob Replacement Fee",
      amount: 25.0,
      status: "pending",
      dueDate: "2024-04-30",
      resident: { name: "Alice Smith", id: "user-2", unit: "Apt 3A" },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleDownload = (id: string) => {
    toast.success(`Downloading invoice receipt for ${id}...`);
  };

  const handlePay = (id: string) => {
    toast.info("Redirecting to secured payment gateway...");
  };

  const getStatusBadge = (status: string) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 font-semibold text-xs border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> Settled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-500 font-semibold text-xs border border-rose-500/20">
        <CircleDashed className="w-3.5 h-3.5" /> Due
      </span>
    );
  };

  // Filter logic
  let filteredPayments = payments;
  if (!isAdmin) {
    filteredPayments = payments.filter(
      (p) => p.resident.id === (currentUser?.id || "user-1"),
    );
  }
  if (searchTerm) {
    filteredPayments = filteredPayments.filter(
      (p) =>
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (isAdmin &&
          p.resident.name.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }

  // Calculate totals
  const totalDue = filteredPayments
    .filter((p) => p.status === "pending")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {isAdmin ? "Global Receivables" : "My Invoices"}{" "}
            <Receipt className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-muted-foreground mt-2 tracking-wide">
            {isAdmin
              ? "Review community balances and financial flow."
              : "Review and satisfy your open balances."}
          </p>
        </div>
        {!isAdmin && (
          <Card className="px-6 py-4 bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg border-0 shrink-0">
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">
              Total Outstanding
            </p>
            <p className="text-3xl font-black">${totalDue.toFixed(2)}</p>
          </Card>
        )}
      </div>

      <Card className="p-0 border-border shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border bg-muted/10 grid gap-4 items-center md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={
                isAdmin
                  ? "Search by invoice ID, resident, or description..."
                  : "Search invoices..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border/50 hover:border-primary/50 transition-colors w-full md:w-96"
            />
          </div>
          <Button
            variant="outline"
            className="text-muted-foreground font-medium">
            <Filter className="h-4 w-4 mr-2" /> Filter Views
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/30 text-muted-foreground font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-4">Invoice Ref</th>
                <th className="px-6 py-4">Description</th>
                {isAdmin && <th className="px-6 py-4">Billed To</th>}
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">DueDate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Documents</th>
                {!isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 8}
                    className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground/30 mb-3" />
                      <p className="font-semibold text-foreground">
                        No invoices found
                      </p>
                      <p className="text-xs">Adjust your search filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4 font-medium text-muted-foreground font-mono text-xs">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground tracking-wide">
                      {payment.description}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {payment.resident.name}
                        </span>
                        <br />
                        <span className="text-xs">{payment.resident.unit}</span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right font-black text-foreground">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(payment.dueDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(payment.id)}
                        className="h-8 text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10">
                        <ArrowDownToLine className="h-4 w-4 mr-2" /> PDF
                      </Button>
                    </td>
                    {!isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handlePay(payment.id)}
                            disabled={payment.status === "paid"}
                            className={
                              payment.status === "paid"
                                ? ""
                                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                            }
                            variant={
                              payment.status === "paid"
                                ? "secondary"
                                : "default"
                            }>
                            <CreditCard className="h-3.5 w-3.5 mr-2" />
                            {payment.status === "paid" ? "Settled" : "Pay Now"}
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
