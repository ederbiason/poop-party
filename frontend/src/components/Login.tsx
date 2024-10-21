import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import googleIcon from "@/assets/google-icon.svg"

export function Login() {
    return (
        <div className="bg-brown-300 w-full flex flex-col gap-4">
            <div>
                <Label htmlFor="email" className="text-brown-700 text-lg font-semibold">Email</Label>
                <Input 
                    type="email" 
                    id="email" 
                    placeholder="Digite seu email" 
                    startIcon={Mail}
                    className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50"
                />
            </div>

            <div>
                <Label htmlFor="password" className="text-brown-700 text-lg font-semibold">Senha</Label>
                <Input 
                    type="password" 
                    id="password" 
                    placeholder="Digite sua senha" 
                    startIcon={Lock} 
                    className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50" 
                />

                <p className="text-right w-fit ml-auto text-brown-700 underline underline-offset-2 mt-2 cursor-pointer">
                    Esqueceu sua senha?
                </p>
            </div>

            <div className="flex flex-col gap-3 mt-3">
                <Button className="w-full rounded-full p-7 bg-brown-800 text-semibold text-lg text-brown-300">
                    Entrar
                </Button>

                <p className="text-brown-700 font-semibold text-center text-lg">OU</p>

                <Button className="w-full border border-brown-700 rounded-full p-7 bg-brown-100 text-semibold text-lg text-brown-700">
                    <img src={googleIcon} />
                    Entrar com o Google
                </Button>
            </div>
        </div>
    )
}
