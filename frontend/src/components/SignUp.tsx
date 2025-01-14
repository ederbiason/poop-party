import { Input } from "@/components/ui/input"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"

const SignUpSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "A senha precisa ter pelo menos 6 caracteres" }),
    passwordConfirm: z.string().min(6, { message: "A senha precisa ter pelo menos 6 caracteres" })
}).refine(data => data.password === data.passwordConfirm, {
    message: "As senhas não coincidem",
    path: ["passwordConfirm"],
})

type SignUpProps = {
    onSignUpSuccess: () => void
}

export function SignUp({ onSignUpSuccess }: SignUpProps) {
    const form = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirm: "",
        },
    })

    async function onSubmit(values: z.infer<typeof SignUpSchema>) {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/users`, values)
            
            form.reset()
            onSignUpSuccess()
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return (
        <div className="bg-brown-300 w-full flex flex-col gap-4 animate-fade-right">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-3">
                        <FormField
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email" className="text-brown-700 text-lg font-semibold">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="email"
                                            id="email"
                                            placeholder="Digite seu email"
                                            startIcon={Mail}
                                            className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50"
                                            onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="password" className="text-brown-700 text-lg font-semibold">Senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            id="password"
                                            placeholder="Digite sua senha"
                                            startIcon={Lock}
                                            className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="passwordConfirm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="passwordConfirm" className="text-brown-700 text-lg font-semibold">Confirmar senha</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="password"
                                            id="passwordConfirm"
                                            placeholder="Confirme sua senha"
                                            startIcon={Lock}
                                            className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-3 mt-8">
                        <Button type="submit" className="w-full rounded-full p-7 bg-brown-800 font-semibold text-lg text-brown-300">
                            Cadastrar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
