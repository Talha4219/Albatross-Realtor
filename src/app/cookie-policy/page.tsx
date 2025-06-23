
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import type { Metadata } from 'next';

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
            <p>Welcome to Albatross Realtor's Cookie Policy. This page explains what cookies are, how we use them, the types of cookies we use, and how you can manage your cookie preferences.</p>
            
            <h3>What Are Cookies?</h3>
            <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
            
            <h3>How We Use Cookies</h3>
            <p>We use cookies for several reasons, detailed below. Unfortunately, in most cases, there are no industry-standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.</p>
            <ul>
                <li><strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.</li>
                <li><strong>Performance and Analytics Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.</li>
                <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization. For example, we use them to remember your saved properties and login state.</li>
            </ul>

            <h3>Managing Your Cookie Preferences</h3>
            <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser's Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.</p>

            <h3>More Information</h3>
            <p>Hopefully, that has clarified things for you. If you are still looking for more information, you can contact us through one of our preferred contact methods:</p>
            <ul>
                <li>Email: privacy@albatrossrealtor.com</li>
                <li>By visiting this link on our website: <a href="/contact">Contact Us</a></li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
