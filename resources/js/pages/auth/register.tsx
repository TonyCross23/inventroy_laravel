import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { Card } from '@/components/ui/card';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />

            <Card className="w-full max-w-md border-none shadow-xl bg-card/50 backdrop-blur-sm sm:rounded-2xl overflow-hidden">
                <div className="p-8">
                    {/* <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        disableWhileProcessing
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            name="name"
                                            placeholder="Full name"
                                            className="h-11 focus-visible:ring-primary/50 transition-all"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            name="email"
                                            placeholder="email@example.com"
                                            className="h-11 focus-visible:ring-primary/50 transition-all"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password (password)">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            name="password"
                                            placeholder="Password"
                                            className="h-11 focus-visible:ring-primary/50 transition-all"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium">
                                            Confirm password
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            name="password_confirmation"
                                            placeholder="Confirm password"
                                            className="h-11 focus-visible:ring-primary/50 transition-all"
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-3 h-11 w-full font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                                        tabIndex={5}
                                        data-test="register-user-button"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <Spinner className="mr-2 h-4 w-4 animate-spin text-white" />
                                        ) : null}
                                        Create account
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-muted-foreground mt-2">
                                    Already have an account?{' '}
                                    <TextLink
                                        href={login()}
                                        tabIndex={6}
                                        className="font-semibold text-primary hover:underline underline-offset-4"
                                    >
                                        Log in
                                    </TextLink>
                                </div>
                            </>
                        )}
                    </Form> */}
                </div>
            </Card>
        </AuthLayout>
    );
}