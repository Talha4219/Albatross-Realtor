
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Albatross Realtor',
  description: 'Read the terms and conditions for using the Albatross Realtor website and services.',
};

export default function TermsOfServicePage() {
  const lastUpdated = "July 29, 2024";

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <FileText className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Terms of Service</CardTitle>
          <CardDescription className="text-lg">
            Last Updated: {lastUpdated}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none text-foreground/90">
            <h3>1. Agreement to Terms</h3>
            <p>By using our website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time.</p>

            <h3>2. Use of the Site</h3>
            <p>You agree to use the Albatross Realtor website for lawful purposes only. You are prohibited from posting on or transmitting through the site any material that is unlawful, harmful, threatening, abusive, or otherwise objectionable. You are responsible for ensuring that any information you provide is accurate and not misleading.</p>

            <h3>3. Intellectual Property</h3>
            <p>The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights, trademarks, and other proprietary rights. The copying, redistribution, or publication by you of any such matters or any part of the Site is strictly prohibited.</p>

            <h3>4. User Accounts</h3>
            <p>If you create an account on our website, you are responsible for maintaining the security of your account, and you are fully responsible for all activities that occur under the account. You must immediately notify us of any unauthorized uses of your account or any other breaches of security.</p>
            
            <h3>5. Disclaimers and Limitation of Liability</h3>
            <p>The information on our site is provided on an "as is," "as available" basis. You agree that use of this site is at your sole risk. We disclaim all warranties of any kind, including but not limited to any express warranties, statutory warranties, and any implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We shall not be liable for any loss, injury, claim, liability, or damage of any kind resulting in any way from your use of the site.</p>
            
            <h3>6. Governing Law</h3>
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is based, without regard to its conflict of law principles.</p>
            
             <h3>7. Contact Information</h3>
            <p>If you have any questions about these Terms, please contact us at <a href="/contact">our contact page</a> or email us at legal@albatrossrealtor.com.</p>
        </CardContent>
      </Card>
    </div>
  );
}
