import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SignUp() {
    return (
        <div className="bg-brown-300 w-full flex flex-col gap-4 animate-fade-right">
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
            </div>

            <div>
                <Label htmlFor="passwordConfirm" className="text-brown-700 text-lg font-semibold">Confirmar senha</Label>
                <Input 
                    type="password" 
                    id="passwordConfirm" 
                    placeholder="Confirme sua senha" 
                    startIcon={Lock} 
                    className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50" 
                />
            </div>

            <div className="flex flex-col gap-3 mt-5">
                <Button className="w-full rounded-full p-7 bg-brown-800 text-semibold text-lg text-brown-300">
                    Cadastrar
                </Button>
            </div>
        </div>
    )
}
