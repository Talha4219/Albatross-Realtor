
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailQuestion, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    subject: z.string().min(5, "Subject must be at least 5 characters."),
    message: z.string().min(20, "Message must be at least 20 characters."),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
    const { toast } = useToast();
    const form = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    const { isSubmitting } = form.formState;

    const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Failed to send message.");
            }
            toast({
                title: "Message Sent!",
                description: "Thank you for contacting us. We will get back to you shortly.",
            });
            form.reset();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An unknown error occurred.",
                variant: "destructive",
            });
        }
    };

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit mb-4">
                <MailQuestion className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-headline font-bold text-primary">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
                We're here to help! Whether you have a question about a property, our services, or anything else, our team is ready to answer all your questions.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-2xl font-semibold font-headline mb-4">Send us a Message</h2>
                <Card>
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="subject" render={({ field }) => (
                                    <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Inquiry about property #123" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                 <FormField control={form.control} name="message" render={({ field }) => (
                                    <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Your message..." {...field} rows={5}/></FormControl><FormMessage /></FormItem>
                                )}/>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Message
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
             <div>
                <h2 className="text-2xl font-semibold font-headline mb-4">Our Information</h2>
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex-row items-center gap-4">
                            <Phone className="w-6 h-6 text-primary" />
                            <CardTitle className="font-headline text-xl">Phone</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            <p><strong>Primary:</strong> <a href="tel:+923216340539" className="hover:text-primary">+92 321 6340539</a></p>
                            <p><strong>Secondary:</strong> <a href="tel:+923330966025" className="hover:text-primary">+92 333 0966025</a></p>
                            <p className="text-xs mt-1">Mon-Fri, 9am - 6pm</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex-row items-center gap-4">
                            <Mail className="w-6 h-6 text-primary" />
                            <CardTitle className="font-headline text-xl">Email</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            <p><strong>Support:</strong> <a href="mailto:support@albatrossrealtor.com" className="hover:text-primary">support@albatrossrealtor.com</a></p>
                            <p><strong>Inquiries:</strong> <a href="mailto:info@albatrossrealtor.com" className="hover:text-primary">info@albatrossrealtor.com</a></p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex-row items-center gap-4">
                            <MapPin className="w-6 h-6 text-primary" />
                            <CardTitle className="font-headline text-xl">Office</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            <p>541F, Block 'D', Main Boulevard, Wapda Town, Islamabad</p>
                            <Button variant="link" className="p-0 h-auto mt-1" asChild>
                                <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Get Directions</a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
