"use client";
import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  Shield,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  University,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { admin, contractABI, contractAddress } from "../abi";

enum PaymentStatus {
  Staged = 0,
  Released = 1,
  Refunded = 2,
}

interface ContractPayment {
  id: bigint;
  payer: string;
  amount: bigint;
  institution: string;
  released: boolean;
  invoiceRef: string;
  status: number;
}

export default function AdminDashboard() {
  const { address, isConnected } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] =
    useState<ContractPayment | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"release" | "refund" | null>(
    null
  );
  const [releaseAddress, setReleaseAddress] = useState("");

  const isAdmin = address === admin;

  const {
    data: contractPayments,
    isLoading: paymentsLoading,
    refetch: refetchPayments,
  } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getPayments",
    args: [],
  }) as {
    data: ContractPayment[];
    isLoading: boolean;
    refetch: () => void;
  };

  const {
    writeContract: releasePayment,
    isPending: isReleasePending,
    data: releaseHash,
  } = useWriteContract();

  const {
    writeContract: refundPayment,
    isPending: isRefundPending,
    data: refundHash,
  } = useWriteContract();

  const { isLoading: isReleaseConfirming, isSuccess: isReleaseSuccess } =
    useWaitForTransactionReceipt({
      hash: releaseHash,
    });

  const { isLoading: isRefundConfirming, isSuccess: isRefundSuccess } =
    useWaitForTransactionReceipt({
      hash: refundHash,
    });

  const payments: ContractPayment[] = contractPayments || [];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      !searchTerm ||
      payment.invoiceRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.payer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "staged" && payment.status === PaymentStatus.Staged) ||
      (statusFilter === "released" &&
        payment.status === PaymentStatus.Released) ||
      (statusFilter === "refunded" &&
        payment.status === PaymentStatus.Refunded);

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    if (isReleaseSuccess || isRefundSuccess) {
      refetchPayments();
      setIsActionDialogOpen(false);
      setSelectedPayment(null);
      setActionType(null);
      setReleaseAddress("");
    }
  }, [isReleaseSuccess, isRefundSuccess, refetchPayments]);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case PaymentStatus.Staged:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Staged
          </Badge>
        );
      case PaymentStatus.Released:
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Released
          </Badge>
        );
      case PaymentStatus.Refunded:
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Unknown
          </Badge>
        );
    }
  };

  const handleReleasePayment = async () => {
    if (!selectedPayment || !releaseAddress) return;

    try {
      releasePayment({
        address: contractAddress,
        abi: contractABI,
        functionName: "release",
        args: [selectedPayment.id, releaseAddress as `0x${string}`],
      });
    } catch (error) {
      console.error("Failed to release payment:", error);
      alert("Failed to release payment. Please try again.");
    }
  };

  const handleRefundPayment = async () => {
    if (!selectedPayment) return;
    console.log("Refunding payment:", selectedPayment.id);

    try {
      refundPayment({
        address: contractAddress,
        abi: contractABI,
        functionName: "refund",
        args: [Number(selectedPayment.id)],
      });
    } catch (error) {
      console.error("Failed to refund payment:", error);
      alert("Failed to refund payment. Please try again.");
    }
  };

  const openActionDialog = (
    payment: ContractPayment,
    action: "release" | "refund"
  ) => {
    setSelectedPayment(payment);
    setActionType(action);
    setIsActionDialogOpen(true);
  };

  const stagedCount = payments.filter(
    (p) => p.status === PaymentStatus.Staged
  ).length;
  const completedCount = payments.filter(
    (p) => p.status === PaymentStatus.Released
  ).length;
  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const stagedAmount = payments
    .filter((p) => p.status === PaymentStatus.Staged)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const formatAmount = (amount: bigint) => {
    return (Number(amount) / 1e6).toLocaleString();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              Please connect your wallet to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Your wallet address is not authorized to access the admin
              dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Connected wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">EduPay Admin</h1>
              <p className="text-sm text-slate-500">
                Payment Management Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Admin Connected
            </Badge>
            <div className="text-sm text-slate-600">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Staged Payments
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stagedCount}
              </div>
              <p className="text-xs text-slate-500">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Released</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedCount}
              </div>
              <p className="text-xs text-slate-500">Successfully released</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Staged Amount
              </CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                ${(stagedAmount / 1e6).toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">USDC awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Volume
              </CardTitle>
              <DollarSign className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(totalAmount / 1e6).toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">All time</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Management</CardTitle>
            <CardDescription>
              Review and manage all payment requests from the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by invoice, institution, or wallet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2 flex-shrink-0" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="min-w-[12rem]">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="staged">Staged</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {paymentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-500">Loading payments...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Invoice Reference</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payer Wallet</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id.toString()}>
                      <TableCell className="font-mono text-sm">
                        #{payment.id.toString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>{payment.invoiceRef}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <University className="w-4 h-4 text-slate-500" />
                          <span>{payment.institution}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          ${formatAmount(payment.amount)}
                        </div>
                        <div className="text-xs text-slate-500">USDC</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {payment.payer.slice(0, 6)}...
                        {payment.payer.slice(-4)}
                      </TableCell>
                      <TableCell>
                        {payment.status === PaymentStatus.Staged ? (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                openActionDialog(payment, "release")
                              }
                              disabled={isReleasePending || isReleaseConfirming}
                              className="bg-emerald-600 hover:bg-emerald-700"
                              title="Release payment to institution"
                            >
                              {(isReleasePending || isReleaseConfirming) &&
                              selectedPayment?.id === payment.id &&
                              actionType === "release" ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <ArrowUpRight className="w-3 h-3" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                openActionDialog(payment, "refund")
                              }
                              disabled={isRefundPending || isRefundConfirming}
                              className="bg-red-600 hover:bg-red-700"
                              title="Refund payment to payer"
                            >
                              {(isRefundPending || isRefundConfirming) &&
                              selectedPayment?.id === payment.id &&
                              actionType === "refund" ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <ArrowDownLeft className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant="secondary"
                            className={
                              payment.status === PaymentStatus.Released
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {payment.status === PaymentStatus.Released
                              ? "Released"
                              : "Refunded"}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {filteredPayments.length === 0 && !paymentsLoading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No payments found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="bg-white opacity-100 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle>
              {actionType === "release" ? "Release Payment" : "Refund Payment"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "release"
                ? "This will release the funds to the specified address. This action cannot be undone."
                : "This will refund the payment to the original payer. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Payment ID:</span>
                  <span className="font-mono">
                    #{selectedPayment.id.toString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">
                    Invoice Reference:
                  </span>
                  <span className="font-medium">
                    {selectedPayment.invoiceRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Institution:</span>
                  <span className="font-medium">
                    {selectedPayment.institution}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Amount:</span>
                  <span className="font-medium">
                    ${formatAmount(selectedPayment.amount)} USDC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Status:</span>
                  {getStatusBadge(selectedPayment.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">
                    Original Payer:
                  </span>
                  <span className="font-mono text-sm">
                    {selectedPayment.payer}
                  </span>
                </div>
              </div>

              {actionType === "release" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Release to Address:
                  </label>
                  <Input
                    placeholder="0x..."
                    value={releaseAddress}
                    onChange={(e) => setReleaseAddress(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-xs text-slate-500">
                    Enter the address where the funds should be sent (typically
                    the institution&apos;s wallet)
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsActionDialogOpen(false);
                    setReleaseAddress("");
                  }}
                  disabled={
                    isReleasePending ||
                    isReleaseConfirming ||
                    isRefundPending ||
                    isRefundConfirming
                  }
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={
                    actionType === "release"
                      ? handleReleasePayment
                      : handleRefundPayment
                  }
                  disabled={
                    (actionType === "release" &&
                      (!releaseAddress ||
                        isReleasePending ||
                        isReleaseConfirming)) ||
                    (actionType === "refund" &&
                      (isRefundPending || isRefundConfirming))
                  }
                  className={`flex-1 ${
                    actionType === "release"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {(actionType === "release" &&
                    (isReleasePending || isReleaseConfirming)) ||
                  (actionType === "refund" &&
                    (isRefundPending || isRefundConfirming)) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isReleasePending || isRefundPending
                        ? "Confirming..."
                        : "Processing..."}
                    </>
                  ) : (
                    <>
                      {actionType === "release" ? (
                        <>
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Release Payment
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="w-4 h-4 mr-2" />
                          Refund Payment
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
