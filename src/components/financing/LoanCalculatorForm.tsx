
"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Percent, CalendarClock, PiggyBank } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const LoanCalculatorSchema = z.object({
  principal: z.coerce.number().min(1000, "Loan amount must be at least $1,000.").max(100000000, "Loan amount cannot exceed $100,000,000."),
  annualInterestRate: z.coerce.number().min(0.1, "Interest rate must be at least 0.1%.").max(30, "Interest rate cannot exceed 30%."),
  loanTenureYears: z.coerce.number().min(1, "Loan tenure must be at least 1 year.").max(40, "Loan tenure cannot exceed 40 years."),
});
type FormData = z.infer<typeof LoanCalculatorSchema>;

interface CalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export default function LoanCalculatorForm() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(LoanCalculatorSchema),
    defaultValues: {
      principal: 100000,
      annualInterestRate: 5,
      loanTenureYears: 20,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const { principal, annualInterestRate, loanTenureYears } = data;
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = loanTenureYears * 12;

    if (monthlyInterestRate === 0) { // Handle zero interest rate case
        const monthlyPayment = principal / numberOfPayments;
        setResult({
            monthlyPayment,
            totalPayment: principal,
            totalInterest: 0,
        });
        return;
    }

    const monthlyPayment = (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
                           (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
    });
  };

  // Trigger calculation on initial load with default values
  React.useEffect(() => {
    form.handleSubmit(onSubmit)();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="principal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><PiggyBank className="w-4 h-4 text-muted-foreground" />Loan Amount ($)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 250000" {...field} className="text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="annualInterestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><Percent className="w-4 h-4 text-muted-foreground" />Annual Interest Rate (%)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 3.5" {...field} className="text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="loanTenureYears"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1"><CalendarClock className="w-4 h-4 text-muted-foreground" />Loan Tenure (Years)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 30" {...field} className="text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full font-headline text-lg py-3">
            <Calculator className="mr-2 h-5 w-5" />
            Calculate
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="mt-8 bg-secondary/50 border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Estimated Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">Monthly Payment:</p>
              <p className="text-2xl font-semibold text-accent">
                ${result.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <p className="text-md">Total Principal Paid:</p>
              <p className="text-lg font-medium text-foreground">
                ${form.getValues('principal').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-md">Total Interest Paid:</p>
              <p className="text-lg font-medium text-foreground">
                ${result.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Total Cost of Loan:</p>
              <p className="text-xl font-bold text-primary">
                ${result.totalPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
           <CardContent>
             <CardDescription className="text-xs text-muted-foreground pt-4">
                This calculator provides an estimate for informational purposes only and may not reflect all fees or actual loan terms. Consult with a financial advisor for personalized advice.
              </CardDescription>
           </CardContent>
        </Card>
      )}
    </div>
  );
}
