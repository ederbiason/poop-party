import { Input } from "@/components/ui/input"
import { Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import googleIcon from "@/assets/google-icon.svg"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const FormSchema = z.object({
    email: z.string().min(1, "O email é obrigatório!").email("Email inválido."),
    password: z.string().min(1, "A senha é obrigatória!"),
})

export function Login() {
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/auth/login`, values)

            const token = response.data.access_token
            localStorage.setItem('token', token)

            form.reset()
            navigate("/")

            return token
        } catch (error: any) {
            console.error("Erro de login:", error)
            throw error
        }
    }

    return (
        <div className="bg-brown-300 w-full flex flex-col gap-4 animate-fade-left">
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
                                    <p className="text-right w-fit ml-auto text-brown-700 underline underline-offset-2 mt-2 cursor-pointer">
                                        Esqueceu sua senha?
                                    </p>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-3 mt-5">
                        <Button type="submit" className="w-full rounded-full p-7 bg-brown-800 font-semibold text-lg text-brown-300">
                            Entrar
                        </Button>

                        <p className="text-brown-700 font-semibold text-center text-lg">OU</p>

                        <Button className="w-full border border-brown-700 rounded-full p-7 bg-brown-100 font-semibold text-lg text-brown-700 flex items-center justify-center gap-2">
                            <img src={googleIcon} alt="Google Icon" />
                            Entrar com o Google
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
