"use client";
import { useEffect, useState } from "react";
import { Button } from "./button";
import {
  ArrowRight,
  Wallet,
  University,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  VenusAndMarsIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Badge } from "./badge";
import { Alert, AlertDescription } from "./alert";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useWriteContract,
  useReadContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  admin,
  contractABI,
  contractAddress,
  stablecoinABI,
  stablecoinAddress,
} from "@/app/abi";
import Link from "next/link";
import { waitForTransactionReceipt } from "viem/actions";

const formSchema = z.object({
  university: z.string().min(1, "Please select a university"),
  amount: z
    .string()
    .min(1, "Please enter an amount")
    .refine((val) => Number.parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    })
    .refine((val) => Number.parseFloat(val) <= 100000, {
      message: "Amount cannot exceed $100,000",
    }),
  invoiceRef: z
    .string()
    .min(3, "Invoice reference must be at least 3 characters"),
});

type FormData = z.infer<typeof formSchema>;
type currentAllowanceType = {
  data: bigint;
};

export const CTA = () => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const universities = [
    { name: "MIT", location: "Cambridge, MA", fee: "~$55,000" },
    { name: "Harvard University", location: "Cambridge, MA", fee: "~$54,000" },
    { name: "Stanford University", location: "Stanford, CA", fee: "~$56,000" },
    { name: "University of Oxford", location: "Oxford, UK", fee: "~£28,000" },
    {
      name: "National University of Singapore",
      location: "Singapore",
      fee: "~S$37,000",
    },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      university: "",
      amount: "",
      invoiceRef: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    clearErrors,
  } = form;

  const watchedValues = watch();
  const selectedUniversity = universities.find(
    (uni) => uni.name === watchedValues.university
  );

  const { data: currentAllowance, refetch } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "checkAllowance",
    args: [address],
  });

  // set refetch interval to 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  const [approvalTxHash, setApprovalTxHash] = useState<
    `0x${string}` | undefined
  >(undefined);
  const [shouldDeposit, setShouldDeposit] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const { isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({
    hash: approvalTxHash,
  });

  useEffect(() => {
    if (isApprovalConfirmed && formData) {
      handleDeposit(formData); // trigger deposit after approval confirms
    }
  }, [isApprovalConfirmed, formData]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setFormData(data); // save form data for post-approval step

    try {
      const paymentAmount = Number.parseFloat(data.amount) * 1e6;

      if ((currentAllowance as bigint) < BigInt(paymentAmount)) {
        console.log("Insufficient allowance, requesting approval...");

        const approvalTxHash = await writeContractAsync({
          address: stablecoinAddress,
          abi: stablecoinABI,
          functionName: "approve",
          args: [contractAddress, paymentAmount],
        });

        console.log("Approval tx sent:", approvalTxHash);
        setApprovalTxHash(approvalTxHash); // this triggers useWaitForTransactionReceipt
      } else {
        await handleDeposit(data); // skip approval, go straight to deposit
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Transaction failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDeposit = async (data: FormData) => {
    try {
      const paymentAmount = Number.parseFloat(data.amount) * 1e6;

      const paymentTxHash = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "deposit",
        args: [paymentAmount, data.university, data.invoiceRef],
      });

      console.log("Deposit transaction:", paymentTxHash);
      alert("Payment submitted successfully!");
      reset();
      setIsOpen(false);
    } catch (err) {
      console.error("Deposit failed:", err);
      alert("Deposit failed. Please try again.");
    } finally {
      setIsLoading(false);
      setApprovalTxHash(undefined);
      setFormData(null);
    }
  };
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-white items-center justify-center flex"
          >
            Start Sending Payments
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl bg-white p-0 shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                Send Tuition Payment
              </DialogTitle>
              <p className="text-emerald-100 mt-2">
                Secure, fast, and transparent payments using USDC stablecoin
              </p>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {/* Wallet Status */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-slate-600" />
                <span className="font-medium text-slate-700">
                  Wallet Status
                </span>
              </div>
              {address ? (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Not Connected
                </Badge>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <University className="w-4 h-4" />
                    Select University
                  </label>
                  <select
                    {...register("university")}
                    onChange={(e) => {
                      register("university").onChange(e);
                      if (errors.university) {
                        clearErrors("university");
                      }
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.university
                        ? "border-red-300"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <option value="">Choose your university...</option>
                    {universities.map((uni) => (
                      <option key={uni.name} value={uni.name}>
                        {uni.name} - {uni.location}
                      </option>
                    ))}
                  </select>
                  {errors.university && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.university.message}
                    </p>
                  )}
                  {selectedUniversity && (
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <p className="text-sm text-emerald-700">
                        <strong>{selectedUniversity.name}</strong> •{" "}
                        {selectedUniversity.location}
                      </p>
                      <p className="text-xs text-emerald-600 mt-1">
                        Typical annual tuition: {selectedUniversity.fee}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <DollarSign className="w-4 h-4" />
                    Payment Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      {...register("amount")}
                      onChange={(e) => {
                        register("amount").onChange(e);
                        if (errors.amount) {
                          clearErrors("amount");
                        }
                      }}
                      className={`w-full px-4 py-3 pl-16 border-2 rounded-lg bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.amount
                          ? "border-red-300"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      placeholder="0.00"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium pointer-events-none">
                      USDC
                    </div>
                  </div>

                  {errors.amount && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.amount.message}
                    </p>
                  )}
                  {watchedValues.amount &&
                    Number.parseFloat(watchedValues.amount) > 0 && (
                      <p className="text-xs text-slate-500">
                        ≈ $
                        {Number.parseFloat(
                          watchedValues.amount
                        ).toLocaleString()}{" "}
                        USD (1:1 with USDC)
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FileText className="w-4 h-4" />
                    Invoice Reference
                  </label>
                  <input
                    type="text"
                    {...register("invoiceRef")}
                    onChange={(e) => {
                      register("invoiceRef").onChange(e);
                      if (errors.invoiceRef) {
                        clearErrors("invoiceRef");
                      }
                    }}
                    className={`w-full px-4 py-3 border-2 rounded-lg bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.invoiceRef
                        ? "border-red-300"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    placeholder="e.g., INV-2024-001, TUITION-FALL-2024"
                  />
                  {errors.invoiceRef && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.invoiceRef.message}
                    </p>
                  )}
                </div>
              </div>

              <Alert className="border-emerald-200 bg-emerald-50">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700">
                  Your payment will be held securely in a smart contract until
                  verified and approved by our admin system.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                {!address ? (
                  <Button
                    type="button"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet First
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 border-2"
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Submit Payment
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {address === admin ? (
        <Button
          size="lg"
          variant="outline"
          className="text-lg px-8 py-3 border-2 hover:bg-slate-50 transition-all duration-200 hover:shadow-lg"
          onClick={() => (window.location.href = "/admin")}
        >
          Admin Console
        </Button>
      ) : (
        <Button
          size="lg"
          variant="outline"
          className="text-lg px-8 py-3 border-2 hover:bg-slate-50 transition-all duration-200 hover:shadow-lg"
          onClick={() => console.log("For Universities clicked")}
        >
          For Universities
        </Button>
      )}
    </div>
  );
};
