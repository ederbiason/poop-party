import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SquarePlus } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { User } from "@/types/user"

const CreatePartySchema = z.object({
    name: z.string().min(1, "Nome da party é obrigatório"),
    endDate: z.string().min(1, "Data de término é obrigatória"),
})

interface Member extends Partial<User> {
    userId: string
    individualShits: number
}

export function CreatePartyForm() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN

    const form = useForm({
        resolver: zodResolver(CreatePartySchema),
        defaultValues: {
            name: "",
            endDate: "",
            memberEmail: "",
        },
    });

    const [members, setMembers] = useState<Member[]>([])
    const { toast } = useToast()

    const addMember = async (email: string) => {
        try {
            const response = await axios.get(`${BACKEND_DOMAIN}/users/email/${email}`)
            const user: User = response.data
            const userId = user._id

            const alreadyExists = members.some(member => member.userId === userId)

            if (alreadyExists) {
                toast({
                    variant: "destructive",
                    title: "O usuário já esta na lista de membros",
                    description: "Tente adicionar outro membro",
                })
                console.warn("Este usuário já está na lista de membros.")
                return
            }

            setMembers([...members, { userId, individualShits: 0, email }])
            form.resetField("memberEmail")
        } catch (error: any) {
            console.error("Não foi possível adicionar o membro" + error.message)
        }
    }

    const onSubmit = async (data: z.infer<typeof CreatePartySchema>) => {
        try {
            const token = localStorage.getItem("token")

            if (!token) {
                toast({
                    variant: "destructive",
                    title: "Não autorizado",
                    description: "Você precisa estar autenticado para fazer isso",
                })
            }

            const partyData = {
                name: data.name,
                endDate: data.endDate,
                members,
            }

            await axios.post(`${BACKEND_DOMAIN}/parties`, partyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            toast({
                variant: "default",
                title: "Sucesso",
                description: "Party criada com sucesso, divirta-se",
            })

            form.reset()
            setMembers([])
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
        <Dialog>
            <DialogTrigger>
                <Button className="bg-brown-800 hover:bg-brown-500 font-semibold text-base">
                    <SquarePlus />
                    Criar Party
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-brown-100 rounded-lg">
                <DialogHeader className="text-start">
                    <DialogTitle className="text-brown-700 text-2xl">Crie sua Party! 💩</DialogTitle>
                    <DialogDescription className="text-brown-500">
                        Preencha os dados abaixo e crie sua party
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome da Party</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome da party" {...field} className="bg-brown-300 border-brown-600" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data de Término</FormLabel>
                                    <FormControl>
                                        <Input type="date" className="bg-brown-300 border-brown-600" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="memberEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Membros</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-2">
                                            <Input placeholder="Email do membro" {...field} className="bg-brown-300 border-brown-600" />
                                            <Button type="button" onClick={() => addMember(field.value)} className="bg-brown-800 hover:bg-brown-500">
                                                Adicionar
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <ul className="flex flex-col gap-2">
                            {members.map((member, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        type="text"
                                        disabled
                                        className="w-[150px]"
                                        placeholder="Email do usuário"
                                        value={member.email}
                                        onChange={(e) => setMembers(members.map((m, i) =>
                                            i === index ? { ...m, email: e.target.value } : m
                                        ))}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Individual Shits"
                                        value={member.individualShits}
                                        min={0}
                                        onChange={(e) => setMembers(members.map((m, i) =>
                                            i === index ? { ...m, individualShits: Number(e.target.value) } : m
                                        ))}
                                    />
                                    <Button
                                        className="bg-red-800 hover:bg-red-500"
                                        onClick={() => setMembers(members.filter((_, i) => i !== index))}
                                    >
                                        Remover
                                    </Button>
                                </div>
                            ))}
                        </ul>

                        <Button type="submit" className="bg-brown-800 hover:bg-brown-500 mt-2">Criar Party</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}