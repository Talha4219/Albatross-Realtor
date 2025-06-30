
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, FileText, Settings, ShieldCheck, Mail, Info } from 'lucide-react';
import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | Albatross Realtor',
  description: 'Learn how Albatross Realtor uses cookies to enhance your website experience.',
};

export default function CookiePolicyPage() {
  const lastUpdated = "July 29, 2024";

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
            <Cookie className="w-10 h-10" />
          </div>
          <CardTitle className="text-3xl font-headline">Cookie Policy</CardTitle>
          <CardDescription className="text-lg">
            Last Updated: {lastUpdated}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none text-foreground/90">
            <p>This Cookie Policy explains what cookies are and how we use them. You should read this policy to understand what cookies are, how we use them, the types of cookies we use, the information we collect using cookies, how that information is used, and how to control your cookie preferences.</p>
            <p>For further information on how we use, store, and keep your personal data secure, see our <Link href="/privacy-policy" className="text-primary underline">Privacy Policy</Link>.</p>
            
            <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-2">
                            <Info className="w-5 h-5 text-primary" /> What are Cookies?
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base">
                        <p>Cookies are small text files that are stored on your browser or device by websites, apps, online media, and advertisements. They are widely used to make websites work more efficiently and to provide reporting information.</p>
                        <p>Cookies can be "Persistent" or "Session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while Session cookies are deleted as soon as you close your web browser.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" /> How We Use Cookies
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base">
                         <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Website. For example, we use cookies to remember your login status and property preferences.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" /> Types of Cookies We Use
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base">
                         <h4 className="font-semibold mt-2">Essential Website Cookies</h4>
                         <p>These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Website to you, you cannot refuse them without impacting how our Website functions.</p>

                         <h4 className="font-semibold mt-4">Performance and Functionality Cookies</h4>
                         <p>These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like remembering your saved properties) may become unavailable.</p>
                         
                         <h4 className="font-semibold mt-4">Analytics and Customization Cookies</h4>
                         <p>These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" /> How Can You Control Cookies?
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base">
                         <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your web browser. Most browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you.</p>
                         <p>To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.allaboutcookies.org</a>.</p>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-5" className="border-b-0">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-primary" /> Contact Us
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base">
                        <p>If you have any questions about our use of cookies or other technologies, please email us at <a href="mailto:privacy@albatrossrealtor.com" className="text-primary underline">privacy@albatrossrealtor.com</a>.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
