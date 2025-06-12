
"use client";

import LoanCalculatorForm from '@/components/financing/LoanCalculatorForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Coins } from 'lucide-react';

export default function LoanCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Coins className="w-8 h-8 text-primary" />
            Home Loan Calculator
          </CardTitle>
          <CardDescription className="text-lg">
            Estimate your monthly mortgage payments, total interest, and total cost.
            Enter your loan details below to see an estimate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoanCalculatorForm />
        </CardContent>
      </Card>
    </div>
  );
}
