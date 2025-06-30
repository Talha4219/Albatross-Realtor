
"use client";

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import type { Agent } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, Star, CheckCircle, Briefcase, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import AgentContactDialog from '@/components/property/AgentContactDialog';

const renderStars = (rating?: number) => {
    if (typeof rating !== 'number') return null;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            {halfStar && <Star key="half" className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
            {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-yellow-300" />)}
            <span className="ml-2 text-sm text-muted-foreground">({rating.toFixed(1)})</span>
        </div>
    );
};

export default function AgentProfilePage() {
    const params = useParams();
    const { agentId } = params;
    const [agent, setAgent] = useState<Agent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (agentId) {
            const fetchAgent = async () => {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/agents/${agentId}`);
                    if (!res.ok) {
                        if (res.status === 404) notFound();
                        throw new Error("Failed to fetch agent profile");
                    }
                    const data = await res.json();
                    if (data.success) {
                        setAgent(data.data);
                    } else {
                        notFound();
                    }
                } catch (error) {
                    console.error(error);
                    notFound();
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAgent();
        }
    }, [agentId]);

    if (isLoading) {
        return <SkeletonAgentPage />;
    }

    if (!agent) {
        notFound();
        return null;
    }

    const agentInitials = agent.name.split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <div className="container mx-auto max-w-4xl py-12">
            <Card className="overflow-hidden shadow-xl">
                <div className="relative h-48 bg-muted">
                    <Image
                        src="https://placehold.co/1200x300.png"
                        alt="Cover image for agent profile"
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint="office background"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </div>
                <CardContent className="p-6 text-center -mt-20 relative">
                    <Avatar className="w-32 h-32 mx-auto border-4 border-background bg-muted shadow-lg">
                        <AvatarImage src={agent.profilePictureUrl || ''} alt={agent.name} data-ai-hint="person portrait" />
                        <AvatarFallback className="text-4xl">{agentInitials}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-4 text-3xl font-headline text-primary">{agent.name}</CardTitle>
                    <CardDescription className="text-lg text-accent font-medium">Real Estate Agent</CardDescription>
                    {agent.isVerified && (
                        <Badge variant="success" className="mt-2">
                            <CheckCircle className="w-4 h-4 mr-1" /> Verified Professional
                        </Badge>
                    )}
                    <div className="mt-4 flex justify-center">{renderStars(agent.rating)}</div>
                </CardContent>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" />Specialty</h3>
                        <p className="text-muted-foreground">{agent.specialty || 'General Real Estate'}</p>
                    </div>
                     <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" />Contact</h3>
                        <div className="space-y-1 text-muted-foreground">
                            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> <a href={`mailto:${agent.email}`} className="hover:text-primary">{agent.email}</a></p>
                            {agent.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> <span>{agent.phone}</span></p>}
                        </div>
                    </div>
                </CardContent>
                 <CardContent className="p-6 border-t text-center">
                     <h3 className="font-semibold text-lg mb-4">Agent's Listings</h3>
                     <p className="text-muted-foreground mb-4">View all properties listed by {agent.name}.</p>
                     <Button asChild>
                         <Link href={`/admin/properties?userId=${agent.id}`}>View Properties</Link>
                     </Button>
                 </CardContent>
            </Card>
        </div>
    );
}

const SkeletonAgentPage = () => (
    <div className="container mx-auto max-w-4xl py-12 animate-pulse">
        <Card className="overflow-hidden">
            <Skeleton className="h-48 w-full bg-muted" />
            <CardContent className="p-6 text-center -mt-20 relative">
                <Skeleton className="w-32 h-32 rounded-full mx-auto border-4 border-background" />
                <Skeleton className="h-8 w-48 mx-auto mt-4" />
                <Skeleton className="h-6 w-32 mx-auto mt-2" />
                <Skeleton className="h-6 w-36 mx-auto mt-2" />
                <Skeleton className="h-5 w-24 mx-auto mt-4" />
            </CardContent>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t">
                <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-4 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-5 w-24" /><Skeleton className="h-4 w-full" /></div>
            </CardContent>
             <CardContent className="p-6 border-t text-center">
                 <Skeleton className="h-5 w-32 mx-auto mb-4" />
                 <Skeleton className="h-4 w-5/6 mx-auto mb-4" />
                 <Skeleton className="h-10 w-40 mx-auto" />
             </CardContent>
        </Card>
    </div>
);
