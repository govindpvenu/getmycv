'use client';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Session, authClient } from '@/lib/auth-client';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

const formSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
});

export default function ProfileDetails({ user }: { user: Session['user'] }) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user.first_name,
            lastName: user.last_name,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const { firstName, lastName } = values;

        const { data, error } = await authClient.updateUser(
            {
                name: `${firstName} ${lastName}`,
                image: user.image,
            },
            {
                onRequest: () => {
                    setIsLoading(true);
                },
                onSuccess: () => {
                    setIsLoading(false);
                    toast.success('Profile updated successfully');
                },
                onError: (ctx) => {
                    setIsLoading(false);
                    toast.error(
                        ctx.error.message || 'Failed to update profile'
                    );
                },
            }
        );

        console.log('data:', data, 'error:', error);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Controller
                            name="firstName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        First name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your first name"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="lastName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Last name
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter your last name"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                        <div className="space-y-2">
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                readOnly
                                id="email"
                                type="email"
                                defaultValue={user.email}
                                className="bg-muted"
                            />
                        </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Spinner /> : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
